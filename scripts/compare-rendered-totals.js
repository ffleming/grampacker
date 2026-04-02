const config = require('config');
const mongojs = require('mongojs');

const newDataTypes = require('../client/dataTypes.js');

const collections = ['users_prod', 'libraries'];

const oldBaseUrl = 'http://dev.grampacker.net:3001';
const newBaseUrl = 'http://dev.grampacker.net:8080';

const db = mongojs(config.get('databaseUrl'), collections);

let workingListIds = [];
let originalIdsLength;

console.log('loading lists....');

getAllIds()
    .then(compareNextListRender)
    .then(() => {
        console.log('done.');
    })
    .catch((err) => {
        console.log('top level error.');
        console.log(err);
    });

function getAllIds() {
    return new Promise((resolve, reject) => {
        db.users_prod.find({}, (err, users) => {
            if (err) {
                reject(err);
                return;
            }
            if (!users.length) {
                console.log('no users found');
                return;
            }
            console.log(`found ${users.length} users`);


            users.forEach((user) => {
                user.library.categories.forEach((category) => {
                    console.log(category.id);
                });

                const userListIds = user.library.lists.map(list => list.externalId).filter((listId) => {
                    if (!listId) {
                        return false;
                    }
                    return true;
                });
                workingListIds = workingListIds.concat(userListIds);
            });

            console.log('loading complete.');
            console.log(`found ${workingListIds.length} lists.`);

            originalIdsLength = workingListIds.length;

            resolve();
        });
    });
}

function compareNextListRender() {
    if (!workingListIds.length) {
        return Promise.resolve();
    }

    const listId = workingListIds.pop();
    if (!(workingListIds.length % 50)) {
        console.log(`${Math.round(((originalIdsLength - workingListIds.length) / originalIdsLength) * 100)}%`);
    }
    return compareListRender(listId)
        .then(compareNextListRender);
}

function compareListRender(listId) {
    const fullUrlOld = `${oldBaseUrl}/r/${listId}`;
    const fullUrlNew = `${newBaseUrl}/r/${listId}`;

    return Promise.all([
        extractListTotal(fullUrlOld),
        extractListTotal(fullUrlNew),
    ])
        .then(([oldResponse, newResponse]) => {
            if (oldResponse !== newResponse) {
                console.log('difference found!');
                console.log(listId);
            }
        })
        .catch(() => {
            // console.log(`Error comparing list ${listId}`);
        });
}

async function extractListTotal(fullUrl) {
    try {
        const response = await fetch(fullUrl);
        const body = await response.text();
        const totalRow = body.substr(body.indexOf('lpRow lpFooter lpTotal'));
        const totalCell = totalRow.substr(totalRow.indexOf('lpTotalValue'));
        let totalCellBody = totalCell.substr(totalCell.indexOf('>') + 1);
        totalCellBody = totalCellBody.substr(0, totalCellBody.indexOf('<'));
        return totalCellBody;
    } catch (error) {
        throw error;
    }
}


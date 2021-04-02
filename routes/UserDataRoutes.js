'use strict';

const UserData = require('../structures/C2S-UserData');

module.exports = function(app) {
    const UserDataHook = new UserData.Webhook(process.env.USERDATA_AUTH);

    // app.route('/userdata')
    //     .get(UserData.list_userdata)
    //     .post(UserDataHook.middleware(), UserData.write_userdata);

    app.route('/userdata/:playerId')
        // .get(UserData.read_userdata)
        .post(UserData.update_userdata)
        // .delete(UserData.delete_userdata);
}
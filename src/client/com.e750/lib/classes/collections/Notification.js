import Collection from './Collection';
import NotificationModel from 'lib/classes/models/Notification';

export default class NotificationCollection extends Collection {
    constructor (data = [], options = {}) {
        super(data, Object.assign({modelClass: options.modelClass || NotificationModel}, options));
    }
}

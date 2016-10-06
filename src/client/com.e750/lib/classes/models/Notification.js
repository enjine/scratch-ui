import Model from './Model';

export default class Notification extends Model {
    defaults = {
        headline: '',
        message: '',
        statusCode: '',
        icon: ''
    };
}

export {Notification as NotificationModel};


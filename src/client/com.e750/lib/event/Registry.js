const Registry = {
    APP_START: 'start',
    BEFORE_REQUEST: 'beforeRequest',
    BEFORE_XHR: 'beforeXHR',
    COMPONENTS_LOADED: 'componentsLoaded',
    BEFORE_RENDER: 'beforeRender',
    WILL_UPDATE_CHILDREN: 'willUpdateChildren',
    DID_UPDATE_CHILDREN: 'didUpdateChildren',
    PROGRESS_START: 'progress:start',
    DOWNLOAD_PROGRESS: 'progress:download',
    UPLOAD_PROGRESS: 'progress:upload',
    PROGRESS_END: 'progress:end',
    NOTIFY: 'notify',
    COLLECTION_ADD: 'collection:add',
    COLLECTION_REMOVE: 'collection:remove',
    VALIDATION_PASS: 'validation:pass',
    VALIDATION_FAIL: 'validation:fail'
};
export default Registry;
export {Registry as Evt};

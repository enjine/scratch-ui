const Registry = {
	APP_START: 'start',
	BEFORE_AJAX: 'beforeAjax',
	BEFORE_FETCH: 'beforeFetch',
	COMPONENTS_LOADED: 'componentsLoaded',
	BEFORE_RENDER: 'beforeRender',
	WILL_UPDATE_CHILDREN: 'willUpdateChildren',
	DID_UPDATE_CHILDREN: 'didUpdateChildren'
};
export default Registry;
export {Registry as Evt};

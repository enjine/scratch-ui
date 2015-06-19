import {componentMap} from "./components";

export function BaseView(el, opts = {}) {};

Object.assign(BaseView.prototype, {
	el: null,
	model: null,
	collection: null,
	template: null,
	childViews: {},

	render: () => {},

	registerComponents: (scope) => {
		console.log('registering child components for: ', scope);

		let components = scope.el.children;

		if(components.length){
			console.log(components, typeof components, Object.keys(componentMap));
			try {
				[].filter.call(components, (node, idx, arr) => {
					return node.dataset.component;
				})
			}catch(e){
				console.error(e);
				throw e;
			}

			try {
				console.log('component: ', components);
				[].forEach.call(components, (componentEl) => {
					let componentId = componentEl.dataset.component;
					scope.childViews[componentId] = new componentMap[componentId](componentEl);
					console.log('component: ', componentMap[componentId], componentEl, scope.childViews);
				});
			}catch(e){
				console.error(e);
			}
		}else{
			console.info('No child components to register.')
		}
	}
});


export default {BaseView}

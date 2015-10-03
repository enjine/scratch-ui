

const Initializable = {
	setInitialState: function () {
		return this;
	},

	setInitialProps: function (props) {
		this.options = {};
		Object.assign(this.options, props);
	}
};

export default Initializable;

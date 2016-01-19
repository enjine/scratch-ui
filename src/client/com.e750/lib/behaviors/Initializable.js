const Initializable = {
    initState: function () {
        return this;
    },

    initProps: function (props) {
        this.options = {};
        Object.assign(this.options, props);
    }
};

export default Initializable;

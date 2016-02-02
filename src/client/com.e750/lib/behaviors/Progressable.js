import Evt from '../event/Registry';
import utils from '../util/defaults';

const Progressable = {
    showProgress: function() {
        if(!this.el || !this.emit) return false;

        this.el.classList.add('loading');
        this.emit(Evt.PROGRESS_START);
        this.progressId = window.setInterval(() => {
            let progress = this.el.querySelector('progress');
            if(progress){
                let value = parseInt(progress.getAttribute('value'), 10);
                progress.setAttribute('value', value + utils.anyIntBetween(1, 10));
            }else{
                window.clearInterval(this.progressId);
                throw new Error('<progress> element not found in component DOM.');
            }

        }, 200);
        return this;
    },

    done: function () {
        if(!this.el || !this.progressId) return false;

        window.clearInterval(this.progressId);
        this.el.classList.remove('loading');
        return this;
    }
};

export default Progressable;

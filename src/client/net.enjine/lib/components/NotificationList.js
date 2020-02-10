import Component from "./Component";
import Notification from "./Notification";
import NotificationCollection from "lib/classes/collections/Notification";
import Evt from "lib/event/Registry";
import { jst } from "lib/core";
import { getEventPath } from "lib/event/utils";

export default class NotificationList extends Component {
  constructor(el, options = {}) {
    Object.assign(options, {
      id: "ui/notificationList",
      template: options.template || jst.getFromDOM("notificationList"),
      collectionClass: NotificationCollection
      /*collectionData: [
                {headline: 'jim', message: 'james'},
                {headline: 'rudy', message: 'huxtable'}
            ],
            modelData: {
                title: 'Notification Area',
                messages: [
                    {headline: 'barry', message: 'sanders'},
                    {headline: 'ritchie', message: 'sambora'}
                ]
            }*/
    });
    super(el, options);
  }

  initState() {
    this.bindSubscriptions();
    this.bindDOMEvents();
    this.render();
    return this;
  }

  bindSubscriptions() {
    this.subscribe(Evt.NOTIFY, this.onMessageReceived.bind(this));
    this.listenTo(
      this.collection,
      Evt.COLLECTION_ADD,
      this.onCollectionAdd.bind(this)
    );
    this.listenTo(
      this.collection,
      Evt.COLLECTION_REMOVE,
      this.onCollectionAdd.bind(this)
    );
    return this;
  }

  bindDOMEvents() {
    this.delegate("button", "click", this.dismiss.bind(this));
    this.delegate("button.close", "click", this.hide.bind(this));
    return this;
  }

  onMessageReceived(e) {
    if (!e.data) return true;
    this.collection.add(e.data);
    return true;
  }

  onCollectionAdd() {
    this.render();
    this.show();
    return true;
  }

  onCollectionRemove() {
    this.render();
    return true;
  }

  hide() {
    this.el.style.cssText = "display:none;";
  }

  show() {
    this.el.style.cssText = "display:block;";
  }

  dismiss(e) {
    e.stopPropagation();
    let path = e.path || getEventPath(e);
    let componentEl = path.filter(n => {
      if (n.dataset && n.dataset.component) {
        return true;
      }
      return false;
    })[0];
    this.removeChild(componentEl);
  }

  render() {
    if (!this.isMounted()) {
      let parsed = jst.compileToDOM(this.template, this.model.serialize(), {
        notification: jst.getFromDOM("notification")
      });
      this.el.insertBefore(parsed, this.el.children[0]);
      this.el.dataset.mounted = true;
      this.listRootEl = this.el.getElementsByTagName("ul")[0];
      [].forEach.call(this.listRootEl.children, item => {
        this.addChild(new Notification(item));
      });
      return this;
    } else {
      try {
        if (this.collection.length()) {
          let messages = this.collection.models,
            listEl = this.listRootEl,
            message;
          for (let i = 0; i < messages.length; i++) {
            let model = messages[i];
            if (!model.rendered) {
              message = new Notification("li", { modelData: model });
              message.render();
              messages[i].rendered = true;
              this.addChild(message);
              listEl.insertBefore(message.el, listEl.children[0]);
            }
          }
        } else {
          this.attachChildren();
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
    return this;
  }
}

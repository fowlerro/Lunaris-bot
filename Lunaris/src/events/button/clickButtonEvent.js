const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class ClickButtonEvent extends BaseEvent {
  constructor() {
    super('clickButton');
  }
  async run (client, button) {
    // if(['firstPage', 'previousPage', 'nextPage', 'lastPage'].includes(button.id)) handleEmbedPageButtons(button);

    // return button.defer(true);
  }
}
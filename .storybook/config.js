import { configure } from '@kadira/storybook';

function loadStories() {
    require('./init.moment');

    require('./DatePicker');
    require('./DateRangePicker');
    require('./Select');
}

configure(loadStories, module);

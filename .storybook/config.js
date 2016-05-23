import { configure } from '@kadira/storybook';

function loadStories() {
    require('./init.moment');
    require('./DatePicker');
    require('./DateRangePicker');
    // require as many stories as you need.
}

configure(loadStories, module);

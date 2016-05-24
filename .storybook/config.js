import { configure } from '@kadira/storybook';

function loadStories() {
    require('./init.moment');

    require('./Button');
    require('./DatePicker');
    require('./DateRangePicker');
    require('./Select');
}

configure(loadStories, module);

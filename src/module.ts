import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './components/SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions((builder) => {
  return builder
    .addTextInput({
      path: 'apiKey',
      name: 'OpenAI API Key',
      description: 'Your OpenAI API key.',
      defaultValue: ''
    })
    .addRadio({
      path: 'color',
      name: 'Circle Color',
      defaultValue: 'red',
      settings: {
        options: [
          {
            value: 'red',
            label: 'Red'
          },
          {
            value: 'green',
            label: 'Green'
          },
          {
            value: 'blue',
            label: 'Blue'
          }
        ]
      }
    });
    // .addTextInput({
    //   path: 'text',
    //   name: 'Simple text option',
    //   description: 'Description of panel option',
    //   defaultValue: 'Default value of text input option',
    // })
    // .addBooleanSwitch({
    //   path: 'showSeriesCount',
    //   name: 'Show series counter',
    //   defaultValue: false,
    // })
    // .addRadio({
    //   path: 'seriesCountSize',
    //   defaultValue: 'sm',
    //   name: 'Series counter size',
    //   settings: {
    //     options: [
    //       {
    //         value: 'sm',
    //         label: 'Small',
    //       },
    //       {
    //         value: 'md',
    //         label: 'Medium',
    //       },
    //       {
    //         value: 'lg',
    //         label: 'Large',
    //       },
    //     ],
    //   },
    //   showIf: (config) => config.showSeriesCount,
    // });
});

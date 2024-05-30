import React, { useState } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from '@emotion/css';
import { useStyles2, useTheme2 } from '@grafana/ui';

import OpenAI from 'openai';
import html2canvas from 'html2canvas';

interface Props extends PanelProps<SimpleOptions> {}

const getStyles = () => {
  return {
    wrapper: css`
      font-family: Open Sans;
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
};

export const SimplePanel: React.FC<Props> = ({ options, data, width, height, fieldConfig, id }) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const openai = new OpenAI({
    apiKey: options.apiKey,
    dangerouslyAllowBrowser: true
  });

  const [buttonText, setButtonText] = useState('Analyse Dashboard');
  const [buttonEnabled, setButtonEnabled] = useState(true);
  const [analysisText, setAnalysisText] = useState('');
  const [narrate, setNarrate] = useState(true);

  const handleCheckboxChange = (event) => {
    setNarrate(event.target.checked);
  };

  const onButtonClick = async () => {
    try {
      setButtonText('Analysing...');
      setButtonEnabled(false);

      const canvas = await html2canvas(document.body, { useCORS: true });

      let dataUrl = canvas.toDataURL("image/png");
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'This image shows a Grafana Dashboard. Only focus on the panels on the dashboard, excluding the AI Analyser panel. Please explain what the data is showing and share any insights you can gather from it. Use plain formatting in your response. By the way, lighter colours on the heatmap indicate higher usage, darker colours indicate lower usage. Always start with "This dashboard shows..."' },
              {
                type: 'image_url',
                image_url: {
                  'url': dataUrl
                }
              }
            ]
          }
        ]
      });

      const responseContent = `${response.choices[0].message.content}`;

      setAnalysisText(responseContent);

      if (narrate) {
        setButtonText('Generating audio...');

        // Turn text into speech
        const mp3 = await openai.audio.speech.create({
          model: 'tts-1',
          voice: 'alloy',
          input: responseContent
        });

        const arrayBuffer = await mp3.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        
        const audio = new Audio(url);
        audio.play();
      }

      setButtonText('Analyse Dashboard');
      setButtonEnabled(true);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
          display: flex;
          flex-direction: column;
        `
      )}
    >
      <div className={cx(styles.wrapper, css`
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      `)}>
        <button onClick={onButtonClick} disabled={!buttonEnabled}>{buttonText}</button>
        <label>
          <input type='checkbox' checked={narrate} onChange={handleCheckboxChange} />
          Narrate analysis?
        </label>
      </div>
      {analysisText && <div>
        <textarea rows={22} style={{ width: '100%', flex: 1 }}>{analysisText}</textarea>
      </div>}
    </div>
  );
};

import React, { Component } from 'react';
import i18next from 'i18next';

export const ROBO_STATUS = {
  'ANALYZING': 0,
  'COMPOSING': 1,
  'CREATING_MP3': 2,
  'CREATING_PDF': 3,
  'COMPLETE': 4
};

export default class RoboStatus extends Component {
  progressBar = null;

  componentDidMount() {
    this.progressBar = window.$('#roboProgressBar').progressStep({
      fillColor: '#394b59', activeColor: '#48aff0', strokeColor: '#adadad',
      visitedFillColor: '#424242', radius: 18, labelOffset: 28, 'font-size': 11
    });
    this.progressBar.addStep(i18next.t('label.start_robocomposing_analyzing'));
    this.progressBar.addStep(i18next.t('label.start_robocomposing_composing'));
    this.progressBar.addStep(i18next.t('label.start_robocomposing_creating_mp3'));
    this.progressBar.addStep(i18next.t('label.start_robocomposing_creating_pdf'));
    this.progressBar.addStep(i18next.t('label.start_robocomposing_complete'));
    this.progressBar.setCurrentStep(0);
    this.progressBar.refreshLayout();
  }

  componentWillUnmount() {
    this.reset();
  }

  reset() {
    for (var counter = 0; counter < 5; counter++) {
      var currentStep = this.progressBar.getStep(counter);
      currentStep.setVisited(false);
    }
  }

  render() {
    if (this.progressBar) {
      this.progressBar.setCurrentStep(ROBO_STATUS[this.props.status]);
      this.progressBar.refreshLayout();
    }

    return (
      <div id='roboProgressBar' className='robo-status'></div>
    );
  }
}
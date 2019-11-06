/**
 *@ParentComponent: Home
 *@ChildComponent: chartRCMan, ChartSVG
 *@Props:
 */
import React, { useState } from 'react';
import i18next from 'i18next';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ControlGroup, Popover, PopoverInteractionKind } from "@blueprintjs/core";

import { Store } from '../store';
import chartRCMan from '../chartRC/chartRCMan';

import ChartSVG from './ChartSVG';

window.leftRectZoom = 0;
window.rightRectZoom = 0;

export default function Chart() {
  const { state, actions } = React.useContext(Store);

  let [isBubble, setBubble] = useState(state.isShowHelpTooltip);
  if (!state.isShowHelpTooltip) isBubble = false;

  if (!state.charts.length) {
    return null;
  }

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorder = (list, startIndex, endIndex) => {
      let result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      return result;
    };

    const _charts = reorder(
      state.charts,
      result.source.index,
      result.destination.index
    );

    actions.charts_reorder(_charts);
    setBubble(true);
    chartRCMan.rebuildChartOrder(_charts.map(it => it.name));
  }

  const renderInfoContent = (chart) => {
    return (
      <div className='chart-grid-title-description'>
        <div className='title up-title'>{i18next.t(`label.${chart.name}`)}</div>
        <div className='body'>{i18next.t(`help.${chart.name}`)}</div>
      </div>
    );
  };

  const getPHeight = (chart) => {
    let pHeight = (chart.settings.height * chart.settings.yZoom) + 10;

    if (chart.settings.yZoom === 0.5) {
      pHeight = 80;
    } else if (chart.settings.yZoom === 0.6) {
      pHeight = 95;
    } else if (chart.settings.yZoom === 0.7) {
      pHeight = 120;
    }

    return pHeight;
  };

  const getItemStyle = (isDragging, draggableStyle, height) => ({
    background: isDragging ? 'grey' : 'transparent',
    ...draggableStyle,
    height,
  });

  const formatLabel = (chart) => {
    let label = i18next.t(`label.${chart.name}`);
    if (label.startsWith('label.')) {
      label = chart.label;
    }

    if (chart.settings.yZoom === 0.5) {
      label = label.split(' ').map(lb => lb[0] + lb[2] + '.').join('  ');
    } else if (label.split(' ').length === 2) {
      label = label.split(' ');
      label = (<div>{label[0]} <br /> {label[1]}</div>)
    }

    return label;
  };

  return (
    <div className='chart-grid'>
      <div className='chart-grid-title-panel'>
        <DragDropContext onDragEnd={onDragEnd}
          onDragStart={() => {
            setBubble(false);
          }}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef} className='chart-grid-title-list'>
                {state.charts.map((chart, index) => (
                  <Popover
                    key={chart.name}
                    content={renderInfoContent(chart)}
                    disabled={!isBubble}
                    hoverOpenDelay={300}
                    position={'right'}
                    interactionKind={PopoverInteractionKind.HOVER}
                  >
                    <Draggable key={chart.name} draggableId={chart.name} index={index}>
                      {(provided, snapshot) => {
                        let label = i18next.t(`label.${chart.name}`);
                        if (label.startsWith('label.')) {
                          label = chart.label;
                        }
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className='chart-grid-title'
                            id={`chart-title-${chart.name}`}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style,
                              getPHeight(chart) - 2
                            )}
                          >
                            <div className='chart-grid-title-label up-title'
                              id={`chart-grid-title-label-${chart.name}`}
                              style={{
                                height: getPHeight(chart) - 4,
                                left: label.split(' ').length === 2 && chart.settings.yZoom !== 0.5 ? '8%' : '30%'
                              }}>{formatLabel(chart)}</div>
                          </div>
                        );
                      }}
                    </Draggable>
                  </Popover>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className='chart-grid-chart-panel'>
        {state.charts.map((chart, index) => {
          return (
            <ControlGroup
              key={`chart-grid-${chart.name}`}
              id={`chart-grid-${chart.name}`}
              className='chart-grid-panel'
              fill={true}
              style={{ height: getPHeight(chart) }}
            >
              <ChartSVG
                updatePoints={(charts) => actions.charts_update_points(charts)}
                isZoomModeH={state.isZoomModeH}
                isZoomModeV={state.isZoomModeV}
                isSyncPointMode={state.isSyncPointMode}
                syncPoints={state.project.sync_points}
                data={{
                  ...chart,
                  isSecondsAtTop: index === 0,
                  isSecondsAtBottom: index !== 0 && index === (state.charts.length - 1)
                }} />
            </ControlGroup>
          )
        })}
      </div>
    </div>
  );
};

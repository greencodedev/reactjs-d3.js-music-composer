// import * as d3 from '../d3_';

declare var d3;

// import winUtils from './win';

const bisectLeft = d3.bisector(function (d) { return d[0]; }).left;

const buildAllPathPoints = (A, B) => {
  function slope(a, b) {
    if (a[0] === b[0]) {
      return null;
    }

    return (b[1] - a[1]) / (b[0] - a[0]);
  }

  function intercept(point, slope) {
    if (slope === null) {
      return point[0];
    }

    return point[1] - slope * point[0];
  }

  const m = slope(A, B);
  const b = intercept(A, m);

  const coordinates = [];
  for (let x = A[0]; x <= B[0]; x++) {
    const y = m * x + b;
    coordinates.push([x, y]);
  }

  return coordinates;
};

const calcHBottom = (hHeight) => {
  let hBottom;

  switch (hHeight) {
    case 150:
      hBottom = 7;
      break;
    case 185:
      hBottom = 30;
      break;
    // case 200:
    //   hBottom = 40;
    //   break; 
    // case 225:
    //   hBottom = 40;
    //   break; 
    default:
      hBottom = 7;
  }

  return hBottom;
};

const closestPoint = (pathNode, point) => {
  let pathLength = pathNode.getTotalLength();
  let precision = 8;
  let best;
  let bestLength;
  let bestDistance = Infinity;

  for (let scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
    if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
      best = scan;
      bestLength = scanLength;
      bestDistance = scanDistance;
    }
  }

  precision /= 2;
  while (precision > 0.5) {
    let before, after, beforeLength, afterLength, beforeDistance, afterDistance;
    if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
      best = before;
      bestLength = beforeLength;
      bestDistance = beforeDistance;
    } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
      best = after;
      bestLength = afterLength;
      bestDistance = afterDistance;
    } else {
      precision /= 2;
    }
  }

  best = [best.x, best.y];
  best.distance = Math.sqrt(bestDistance);
  return best;

  function distance2(p) {
    const dx = p.x - point[0];
    const dy = p.y - point[1];

    return dx * dx + dy * dy;
  }
};

const findChartStartPoints = (hCount, minX, maxX, minY, maxY, startY) => {
  const xpoints = d3.range(minX, maxX + 1).reduce((acc, n) => {
    if (n !== minX && n % Math.floor(maxX / (hCount - 1)) === 0 && n !== maxX) {
      acc.push(n);
    }
    return acc;
  }, [minX]);

  xpoints.push(maxX);

  return xpoints.map((n, i) => ([n, startY]))
};

const buildChartsFromData = (data, defaultSettings, sessionData) => {
  return data
    .map(it => {
      let points = sessionData ? sessionData[it.name] : null;
      const minX = it.settings.minX || defaultSettings.minX;
      let maxX = +((sessionData || {}).number_seconds || defaultSettings.maxX);
      const minY = it.settings.minY || defaultSettings.minY;
      const maxY = it.settings.maxY || defaultSettings.maxY;
      const startY = it.settings.startY || defaultSettings.startY;

      if (points && points.length > 1) {
        maxX = points[points.length - 1][0];
      } else {
        points = findChartStartPoints(2, minX, maxX, minY, maxY, startY);
      }

      const xZoom = points && points.length ? [points[0][0], points[points.length - 1][0]] : [];

      return {
        ...it,
        settings: {
          ...it.settings,
          minX, maxX, minY, maxY, startY, xZoom,
        },
        points
      };
    });
};

export default {
  bisectLeft,
  buildAllPathPoints,
  calcHBottom,
  closestPoint,
  findChartStartPoints,
  buildChartsFromData
};
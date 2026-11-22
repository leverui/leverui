import { type JSX } from '@solidjs/web';
import { RadarChart, type RadarDatum, type RadarSeries } from '../../src';

/** The five monthly values shared by the single-series stories. */
const monthlyRadarData: readonly RadarDatum[] = [
  { label: 'January', windows: 110 },
  { label: 'February', windows: 130 },
  { label: 'March', windows: 110 },
  { label: 'May', windows: 90 },
  { label: 'June', windows: 75 },
];

/** The six paired monthly values used for two-series comparisons. */
const pairedRadarData: readonly RadarDatum[] = [
  { label: 'January', windows: 30, mac: 100 },
  { label: 'February', windows: 120, mac: 20 },
  { label: 'March', windows: 45, mac: 130 },
  { label: 'May', windows: 140, mac: 40 },
  { label: 'June', windows: 60, mac: 50 },
  { label: 'July', windows: 20, mac: 160 },
];

/** The single teal series from the basic chart. */
const singleSeries: readonly RadarSeries[] = [{ name: 'windows', color: 'teal.solid' }];

/** Teal and orange values in the multiple and lines-only examples. */
const pairedSeries: readonly RadarSeries[] = [
  { name: 'windows', color: 'teal.solid' },
  { name: 'mac', color: 'orange.solid' },
];

/** Show the basic five-axis polygon with a numeric radial axis. */
export function RadarChartBasic(): JSX.Element {
  return <RadarChart data={monthlyRadarData} series={singleSeries} radiusLabels />;
}

/** Compare two unfilled outlines against the shared polar grid. */
export function RadarChartLinesOnly(): JSX.Element {
  return (
    <RadarChart data={pairedRadarData} series={pairedSeries} angleLabels={false} linesOnly legend />
  );
}

/** Compare two translucent, independently colored data polygons. */
export function RadarChartMultiple(): JSX.Element {
  return <RadarChart data={pairedRadarData} series={pairedSeries} angleLabels={false} legend />;
}

/** Draw circular value levels behind the single teal polygon. */
export function RadarChartCircleGrid(): JSX.Element {
  return <RadarChart data={circleRadarData} series={singleSeries} grid="circle" radiusLabels />;
}

/** Mark the five data vertices on the single-series polygon. */
export function RadarChartDots(): JSX.Element {
  return <RadarChart data={monthlyRadarData} series={singleSeries} dots />;
}

/** Tint the grid levels and retain visible point markers. */
export function RadarChartFilledGrid(): JSX.Element {
  return <RadarChart data={monthlyRadarData} series={singleSeries} grid="filled" dots />;
}

/** Print each numeric measurement beside its polygon vertex. */
export function RadarChartPointLabel(): JSX.Element {
  return <RadarChart data={monthlyRadarData} series={singleSeries} pointLabels />;
}

/** Reveal the active category and measurement on pointer or keyboard input. */
export function RadarChartTooltip(): JSX.Element {
  return <RadarChart data={monthlyRadarData} series={singleSeries} tooltip />;
}

/** The alternate values for the circular-grid example. */
const circleRadarData: readonly RadarDatum[] = [
  { label: 'January', windows: 120 },
  { label: 'February', windows: 120 },
  { label: 'March', windows: 80 },
  { label: 'May', windows: 140 },
  { label: 'June', windows: 60 },
];

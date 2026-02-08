import { u as usePageContext, j as jsxRuntimeExports, r as reactExports, i as import5, o as onRenderClient } from '../chunks/chunk-BiSMlUrc.js';
import { G as GenIcon, I as IoClose, i as import3$1 } from '../chunks/chunk-Cj1Pzm3x.js';
import { C as ContentMarker } from '../chunks/chunk-bNc2JGQN.js';
import { t as toDate, d as differenceInCalendarDays, f as format } from '../chunks/chunk-DI4sGg5h.js';
/* empty css                       */
import '../chunks/chunk-C_jR_L7K.js';
/* empty css                       */

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/date-fns@3.6.0/node_modules/date-fns/differenceInDays.mjs [vike:pluginModuleBanner] */

/**
 * @name differenceInDays
 * @category Day Helpers
 * @summary Get the number of full days between the given dates.
 *
 * @description
 * Get the number of full day periods between two dates. Fractional days are
 * truncated towards zero.
 *
 * One "full day" is the distance between a local time in one day to the same
 * local time on the next or previous day. A full day can sometimes be less than
 * or more than 24 hours if a daylight savings change happens between two dates.
 *
 * To ignore DST and only measure exact 24-hour periods, use this instead:
 * `Math.trunc(differenceInHours(dateLeft, dateRight)/24)|0`.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 *
 * @returns The number of full days according to the local timezone
 *
 * @example
 * // How many full days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * const result = differenceInDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 365
 *
 * @example
 * // How many full days are between
 * // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
 * const result = differenceInDays(
 *   new Date(2011, 6, 3, 0, 1),
 *   new Date(2011, 6, 2, 23, 59)
 * )
 * //=> 0
 *
 * @example
 * // How many full days are between
 * // 1 March 2020 0:00 and 1 June 2020 0:00 ?
 * // Note: because local time is used, the
 * // result will always be 92 days, even in
 * // time zones where DST starts and the
 * // period has only 92*24-1 hours.
 * const result = differenceInDays(
 *   new Date(2020, 5, 1),
 *   new Date(2020, 2, 1)
 * )
 * //=> 92
 */
function differenceInDays(dateLeft, dateRight) {
  const _dateLeft = toDate(dateLeft);
  const _dateRight = toDate(dateRight);

  const sign = compareLocalAsc(_dateLeft, _dateRight);
  const difference = Math.abs(differenceInCalendarDays(_dateLeft, _dateRight));

  _dateLeft.setDate(_dateLeft.getDate() - sign * difference);

  // Math.abs(diff in full days - diff in calendar days) === 1 if last calendar day is not full
  // If so, result must be decreased by 1 in absolute value
  const isLastDayNotFull = Number(
    compareLocalAsc(_dateLeft, _dateRight) === -sign,
  );
  const result = sign * (difference - isLastDayNotFull);
  // Prevent negative zero
  return result === 0 ? 0 : result;
}

// Like `compareAsc` but uses local time not UTC, which is needed
// for accurate equality comparisons of UTC timestamps that end up
// having the same representation in local time, e.g. one hour before
// DST ends vs. the instant that DST ends.
function compareLocalAsc(dateLeft, dateRight) {
  const diff =
    dateLeft.getFullYear() - dateRight.getFullYear() ||
    dateLeft.getMonth() - dateRight.getMonth() ||
    dateLeft.getDate() - dateRight.getDate() ||
    dateLeft.getHours() - dateRight.getHours() ||
    dateLeft.getMinutes() - dateRight.getMinutes() ||
    dateLeft.getSeconds() - dateRight.getSeconds() ||
    dateLeft.getMilliseconds() - dateRight.getMilliseconds();

  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1;
    // Return 0 if diff is 0; return NaN if diff is NaN
  } else {
    return diff;
  }
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/vike-react@0.5.13_react-dom@19.1.1_react@19.1.1__react@19.1.1_vike@0.4.239-commit-9dcde6d_pat_nsp4at6jtvun3qxqvkvzymqvou/node_modules/vike-react/dist/hooks/useData.js [vike:pluginModuleBanner] */
function useData() {
    const data = usePageContext()?.data;
    return data;
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/react-icons@5.5.0_react@19.1.1/node_modules/react-icons/di/index.mjs [vike:pluginModuleBanner] */
// THIS FILE IS AUTO GENERATED
function DiNpm (props) {
  return GenIcon({"attr":{"version":"1.1","viewBox":"0 0 32 32"},"child":[{"tag":"path","attr":{"d":"M0.32 15.406v5.248h8.736v1.76h6.976v-1.76h15.649v-10.495h-31.36v5.248zM9.055 15.406v3.488h-1.76v-5.216h-1.697v5.216h-3.582v-6.976h7.039v3.488zM17.779 15.412l-0.019 3.488-3.425-0.012v1.766h-3.582v-8.736h7.039l-0.012 3.494zM29.983 15.406v3.488h-1.76v-5.216h-1.76v5.248l-1.76-0.038v-5.21h-1.697v5.216h-3.519v-6.976h10.495v3.488zM14.335 15.406v1.728h1.634v-3.457h-1.634v1.728z"},"child":[]}]})(props);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/react-icons@5.5.0_react@19.1.1/node_modules/react-icons/fa/index.mjs [vike:pluginModuleBanner] */
// THIS FILE IS AUTO GENERATED
function FaGithub (props) {
  return GenIcon({"attr":{"viewBox":"0 0 496 512"},"child":[{"tag":"path","attr":{"d":"M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"},"child":[]}]})(props);
}function FaCalendar (props) {
  return GenIcon({"attr":{"viewBox":"0 0 448 512"},"child":[{"tag":"path","attr":{"d":"M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"},"child":[]}]})(props);
}function FaGlobe (props) {
  return GenIcon({"attr":{"viewBox":"0 0 496 512"},"child":[{"tag":"path","attr":{"d":"M336.5 160C322 70.7 287.8 8 248 8s-74 62.7-88.5 152h177zM152 256c0 22.2 1.2 43.5 3.3 64h185.3c2.1-20.5 3.3-41.8 3.3-64s-1.2-43.5-3.3-64H155.3c-2.1 20.5-3.3 41.8-3.3 64zm324.7-96c-28.6-67.9-86.5-120.4-158-141.6 24.4 33.8 41.2 84.7 50 141.6h108zM177.2 18.4C105.8 39.6 47.8 92.1 19.3 160h108c8.7-56.9 25.5-107.8 49.9-141.6zM487.4 192H372.7c2.1 21 3.3 42.5 3.3 64s-1.2 43-3.3 64h114.6c5.5-20.5 8.6-41.8 8.6-64s-3.1-43.5-8.5-64zM120 256c0-21.5 1.2-43 3.3-64H8.6C3.2 212.5 0 233.8 0 256s3.2 43.5 8.6 64h114.6c-2-21-3.2-42.5-3.2-64zm39.5 96c14.5 89.3 48.7 152 88.5 152s74-62.7 88.5-152h-177zm159.3 141.6c71.4-21.2 129.4-73.7 158-141.6h-108c-8.8 56.9-25.6 107.8-50 141.6zM19.3 352c28.6 67.9 86.5 120.4 158 141.6-24.4-33.8-41.2-84.7-50-141.6h-108z"},"child":[]}]})(props);
}function FaStar (props) {
  return GenIcon({"attr":{"viewBox":"0 0 576 512"},"child":[{"tag":"path","attr":{"d":"M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"},"child":[]}]})(props);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/react-icons@5.5.0_react@19.1.1/node_modules/react-icons/si/index.mjs [vike:pluginModuleBanner] */
// THIS FILE IS AUTO GENERATED
function SiCplusplus (props) {
  return GenIcon({"attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.11c-3.92 0-7.109-3.19-7.109-7.11 0-3.92 3.19-7.11 7.11-7.11a7.133 7.133 0 016.156 3.553l-3.076 1.78a3.567 3.567 0 00-3.08-1.78A3.56 3.56 0 008.444 12 3.56 3.56 0 0012 15.555a3.57 3.57 0 003.08-1.778l3.078 1.78A7.135 7.135 0 0112 19.11zm7.11-6.715h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79zm2.962 0h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79z"},"child":[]}]})(props);
}function SiCss3 (props) {
  return GenIcon({"attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"},"child":[]}]})(props);
}function SiHtml5 (props) {
  return GenIcon({"attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"},"child":[]}]})(props);
}function SiJavascript (props) {
  return GenIcon({"attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"},"child":[]}]})(props);
}function SiLua (props) {
  return GenIcon({"attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M.38 10.377l-.272-.037c-.048.344-.082.695-.101 1.041l.275.016c.018-.34.051-.682.098-1.02zM4.136 3.289l-.184-.205c-.258.232-.509.48-.746.734l.202.188c.231-.248.476-.49.728-.717zM5.769 2.059l-.146-.235c-.296.186-.586.385-.863.594l.166.219c.27-.203.554-.399.843-.578zM1.824 18.369c.185.297.384.586.593.863l.22-.164c-.205-.271-.399-.555-.58-.844l-.233.145zM1.127 16.402l-.255.104c.129.318.274.635.431.943l.005.01.245-.125-.005-.01c-.153-.301-.295-.611-.421-.922zM.298 9.309l.269.063c.076-.332.168-.664.272-.986l-.261-.087c-.108.332-.202.672-.28 1.01zM.274 12.42l-.275.01c.012.348.04.699.083 1.043l.273-.033c-.042-.336-.069-.68-.081-1.02zM.256 14.506c.073.34.162.682.264 1.014l.263-.08c-.1-.326-.187-.658-.258-.99l-.269.056zM11.573.275L11.563 0c-.348.012-.699.039-1.044.082l.034.273c.338-.041.68-.068 1.02-.08zM23.221 8.566c.1.326.186.66.256.992l.27-.059c-.072-.34-.16-.682-.262-1.014l-.264.081zM17.621 1.389c-.309-.164-.627-.314-.947-.449l-.107.252c.314.133.625.281.926.439l.128-.242zM15.693.572c-.332-.105-.67-.199-1.01-.277l-.063.268c.332.076.664.168.988.273l.085-.264zM6.674 1.545c.298-.15.606-.291.916-.418L7.486.873c-.317.127-.632.272-.937.428l-.015.008.125.244.015-.008zM23.727 11.588l.275-.01a11.797 11.797 0 0 0-.082-1.045l-.273.033c.041.338.068.682.08 1.022zM13.654.105c-.346-.047-.696-.08-1.043-.098l-.014.273c.339.018.683.051 1.019.098l.038-.273zM9.544.527l-.058-.27c-.34.072-.681.16-1.014.264l.081.262c.325-.099.659-.185.991-.256zM1.921 5.469l.231.15c.185-.285.384-.566.592-.834l-.217-.17c-.213.276-.417.563-.606.854zM.943 7.318l.253.107c.132-.313.28-.625.439-.924l-.243-.128c-.163.307-.314.625-.449.945zM18.223 21.943l.145.234c.295-.186.586-.385.863-.594l-.164-.219c-.272.204-.557.4-.844.579zM21.248 19.219l.217.17c.215-.273.418-.561.607-.854l-.23-.148c-.186.285-.385.564-.594.832zM19.855 20.715l.184.203c.258-.23.51-.479.746-.732l-.201-.188c-.23.248-.477.488-.729.717zM22.359 17.504l.244.129c.162-.307.314-.625.449-.945l-.254-.107a11.27 11.27 0 0 1-.439.923zM23.617 13.629l.273.039c.049-.346.082-.695.102-1.043l-.275-.014c-.018.338-.051.682-.1 1.018zM23.156 15.621l.264.086c.107-.332.201-.67.279-1.01l-.268-.063c-.077.333-.169.665-.275.987zM22.453 6.672c.154.303.297.617.424.932l.256-.104c-.131-.322-.277-.643-.436-.953l-.244.125zM8.296 23.418c.331.107.67.201 1.009.279l.062-.268c-.331-.076-.663-.168-.986-.273l-.085.262zM10.335 23.889c.345.049.696.082 1.043.102l.014-.275c-.339-.018-.682-.051-1.019-.098l-.038.271zM17.326 22.449c-.303.154-.613.297-.926.424l.104.256c.318-.131.639-.275.947-.434l.004-.002-.123-.246-.006.002zM4.613 21.467c.274.213.562.418.854.605l.149-.23c-.285-.184-.565-.385-.833-.592l-.17.217zM12.417 23.725l.009.275c.348-.014.699-.041 1.045-.084l-.035-.271c-.336.041-.68.068-1.019.08zM6.37 22.604c.307.162.625.314.946.449l.107-.254c-.313-.133-.624-.279-.924-.439l-.129.244zM3.083 20.041c.233.258.48.51.734.746l.188-.201c-.249-.23-.49-.477-.717-.729l-.205.184zM14.445 23.475l.059.27c.34-.074.68-.162 1.014-.266l-.082-.262c-.325.099-.659.185-.991.258zM21.18.129A2.689 2.689 0 1 0 21.18 5.507 2.689 2.689 0 1 0 21.18.129zM15.324 15.447c0 .471.314.66.852.66.67 0 1.297-.396 1.297-1.016v-.645c-.23.107-.379.141-1.107.24-.735.109-1.042.306-1.042.761zM12 2.818c-5.07 0-9.18 4.109-9.18 9.18 0 5.068 4.11 9.18 9.18 9.18 5.07 0 9.18-4.111 9.18-9.18 0-5.07-4.11-9.18-9.18-9.18zm-2.487 13.77H5.771v-6.023h.769v5.346h2.974v.677zm4.13 0h-.619v-.67c-.405.57-.811.793-1.446.793-.843 0-1.38-.463-1.38-1.182v-3.271h.686v3c0 .52.347.85.893.85.719 0 1.181-.578 1.181-1.461v-2.389h.686v4.33zm-.53-8.393c0-1.484 1.205-2.689 2.689-2.689s2.688 1.205 2.688 2.689-1.203 2.688-2.688 2.688-2.689-1.203-2.689-2.688zm5.567 7.856v.52c-.223.059-.33.074-.471.074-.34 0-.637-.238-.711-.57-.381.406-.918.637-1.471.637-.877 0-1.422-.463-1.422-1.248 0-.527.256-.916.76-1.123.266-.107.414-.141 1.389-.264.545-.066.719-.191.719-.48v-.182c0-.412-.348-.645-.967-.645-.645 0-.957.24-1.016.77h-.693c.041-1 .686-1.404 1.734-1.404 1.066 0 1.627.412 1.627 1.182v2.412c0 .215.133.338.373.338.041-.002.074-.002.149-.017z"},"child":[]}]})(props);
}function SiMdx (props) {
  return GenIcon({"attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M.79 7.12h22.42c.436 0 .79.355.79.792v8.176c0 .436-.354.79-.79.79H.79a.79.79 0 0 1-.79-.79V7.912a.79.79 0 0 1 .79-.791V7.12Zm2.507 7.605v-3.122l1.89 1.89L7.12 11.56v3.122h1.055v-5.67l-2.99 2.99L2.24 9.056v5.67h1.055v-.001Zm8.44-1.845-1.474-1.473-.746.746 2.747 2.747 2.745-2.747-.746-.746-1.473 1.473v-4h-1.054v4Zm10.041.987-2.175-2.175 2.22-2.22-.746-.746-2.22 2.22-2.22-2.22-.747.746 2.22 2.22-2.176 2.177.746.746 2.177-2.177 2.176 2.175.745-.746Z"},"child":[]}]})(props);
}function SiPython (props) {
  return GenIcon({"attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"},"child":[]}]})(props);
}function SiTypescript (props) {
  return GenIcon({"attr":{"role":"img","viewBox":"0 0 24 24"},"child":[{"tag":"path","attr":{"d":"M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"},"child":[]}]})(props);
}

/*! /home/runner/work/craigory-dev/craigory-dev/node_modules/.pnpm/react-icons@5.5.0_react@19.1.1/node_modules/react-icons/bs/index.mjs [vike:pluginModuleBanner] */
// THIS FILE IS AUTO GENERATED
function BsTerminalFill (props) {
  return GenIcon({"attr":{"fill":"currentColor","viewBox":"0 0 16 16"},"child":[{"tag":"path","attr":{"d":"M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm9.5 5.5h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1m-6.354-.354a.5.5 0 1 0 .708.708l2-2a.5.5 0 0 0 0-.708l-2-2a.5.5 0 1 0-.708.708L4.793 6.5z"},"child":[]}]})(props);
}

/*! pages/projects/language-logos.tsx [vike:pluginModuleBanner] */
function getLanguageLogo(language) {
  switch (language) {
    case "TypeScript":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        SiTypescript,
        {
          style: {
            color: "#007acc",
            fontSize: "1.5rem",
            verticalAlign: "middle",
            marginRight: "0.5rem"
          }
        }
      );
    case "JavaScript":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        SiJavascript,
        {
          style: {
            color: "#f0db4f",
            fontSize: "1.5rem",
            verticalAlign: "middle",
            marginRight: "0.5rem"
          }
        }
      );
    case "C#":
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "svg",
        {
          width: "24",
          height: "27",
          viewBox: "0 0 256 288",
          style: {
            fontSize: "1.5rem",
            verticalAlign: "middle",
            marginRight: "0.5rem"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M255.569,84.452376 C255.567,79.622376 254.534,75.354376 252.445,71.691376 C250.393,68.089376 247.32,65.070376 243.198,62.683376 C209.173,43.064376 175.115,23.505376 141.101,3.86637605 C131.931,-1.42762395 123.04,-1.23462395 113.938,4.13537605 C100.395,12.122376 32.59,50.969376 12.385,62.672376 C4.064,67.489376 0.015,74.861376 0.013,84.443376 C0,123.898376 0.013,163.352376 0,202.808376 C0,207.532376 0.991,211.717376 2.988,215.325376 C5.041,219.036376 8.157,222.138376 12.374,224.579376 C32.58,236.282376 100.394,275.126376 113.934,283.115376 C123.04,288.488376 131.931,288.680376 141.104,283.384376 C175.119,263.744376 209.179,244.186376 243.209,224.567376 C247.426,222.127376 250.542,219.023376 252.595,215.315376 C254.589,211.707376 255.582,207.522376 255.582,202.797376 C255.582,202.797376 255.582,123.908376 255.569,84.452376", fill: "#A179DC", fillRule: "nonzero" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M128.182,143.241376 L2.988,215.325376 C5.041,219.036376 8.157,222.138376 12.374,224.579376 C32.58,236.282376 100.394,275.126376 113.934,283.115376 C123.04,288.488376 131.931,288.680376 141.104,283.384376 C175.119,263.744376 209.179,244.186376 243.209,224.567376 C247.426,222.127376 250.542,219.023376 252.595,215.315376 L128.182,143.241376", fill: "#280068", fillRule: "nonzero" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M255.569,84.452376 C255.567,79.622376 254.534,75.354376 252.445,71.691376 L128.182,143.241376 L252.595,215.315376 C254.589,211.707376 255.58,207.522376 255.582,202.797376 C255.582,202.797376 255.582,123.908376 255.569,84.452376", fill: "#390091", fillRule: "nonzero" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M201.892326,116.294008 L201.892326,129.767692 L215.36601,129.767692 L215.36601,116.294008 L222.102852,116.294008 L222.102852,129.767692 L235.576537,129.767692 L235.576537,136.504534 L222.102852,136.504534 L222.102852,149.978218 L235.576537,149.978218 L235.576537,156.71506 L222.102852,156.71506 L222.102852,170.188744 L215.36601,170.188744 L215.36601,156.71506 L201.892326,156.71506 L201.892326,170.188744 L195.155484,170.188744 L195.155484,156.71506 L181.6818,156.71506 L181.6818,149.978218 L195.155484,149.978218 L195.155484,136.504534 L181.6818,136.504534 L181.6818,129.767692 L195.155484,129.767692 L195.155484,116.294008 L201.892326,116.294008 Z M215.36601,136.504534 L201.892326,136.504534 L201.892326,149.978218 L215.36601,149.978218 L215.36601,136.504534 Z", fill: "#FFFFFF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M128.456752,48.625876 C163.600523,48.625876 194.283885,67.7121741 210.718562,96.0819435 L210.558192,95.808876 L169.209615,119.617159 C161.062959,105.823554 146.128136,96.5150717 128.996383,96.3233722 L128.456752,96.3203544 C102.331178,96.3203544 81.1506705,117.499743 81.1506705,143.625316 C81.1506705,152.168931 83.4284453,160.17752 87.3896469,167.094792 C95.543745,181.330045 110.872554,190.931398 128.456752,190.931398 C146.149522,190.931398 161.565636,181.208041 169.67832,166.820563 L169.481192,167.165876 L210.767678,191.083913 C194.51328,219.21347 164.25027,238.240861 129.514977,238.620102 L128.456752,238.625876 C93.2021701,238.625876 62.4315028,219.422052 46.0382398,190.902296 C38.0352471,176.979327 33.4561922,160.837907 33.4561922,143.625316 C33.4561922,91.1592636 75.9884604,48.625876 128.456752,48.625876 Z", fill: "#FFFFFF", fillRule: "nonzero" })
          ]
        }
      );
    case "Python":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        SiPython,
        {
          style: {
            color: "#3776ab",
            fontSize: "1.5rem",
            verticalAlign: "middle",
            marginRight: "0.5rem"
          }
        }
      );
    case "C++":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        SiCplusplus,
        {
          style: {
            color: "#00599c",
            fontSize: "1.5rem",
            verticalAlign: "middle",
            marginRight: "0.5rem"
          }
        }
      );
    case "SCSS":
    case "CSS":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        SiCss3,
        {
          style: {
            color: "#1572b6",
            fontSize: "1.5rem",
            verticalAlign: "middle",
            marginRight: "0.5rem"
          }
        }
      );
    case "HTML":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        SiHtml5,
        {
          style: {
            color: "#e34f26",
            fontSize: "1.5rem",
            verticalAlign: "middle",
            marginRight: "0.5rem"
          }
        }
      );
    case "MDX":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        SiMdx,
        {
          style: {
            color: "#f9ac00",
            fontSize: "1.5rem",
            verticalAlign: "middle",
            marginRight: "0.5rem"
          }
        }
      );
    case "Shell":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        BsTerminalFill,
        {
          style: {
            color: "#000000",
            fontSize: "1.5rem",
            verticalAlign: "middle",
            marginRight: "0.5rem"
          }
        }
      );
    case "Lua":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        SiLua,
        {
          style: {
            color: "#000080",
            fontSize: "1.5rem",
            verticalAlign: "middle",
            marginRight: "0.5rem"
          }
        }
      );
    default:
      console.log(`No icon for language: ${language}`);
      return null;
  }
}

/*! pages/projects/styles.scss [vike:pluginModuleBanner] */

/*! pages/projects/components/filter-search.tsx [vike:pluginModuleBanner] */
function FilterSearch({
  onSearch
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "repo-search-textbox", children: "Search" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        id: "repo-search-textbox",
        type: "text",
        onChange: (e) => onSearch(e.target.value),
        placeholder: "Search projects..."
      }
    ) })
  ] });
}

/*! pages/projects/components/filter-checkbox.tsx [vike:pluginModuleBanner] */
function FilterCheckbox({
  label,
  onValueChange,
  allowIndeterminate,
  defaultValue
}) {
  const [value, setValue] = reactExports.useState(defaultValue);
  const input = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (value === null && allowIndeterminate && input.current) {
      input.current.indeterminate = true;
    }
  }, [value, input, allowIndeterminate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: label + "-checkbox", children: label }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        checked: value === true,
        ref: input,
        id: label + "-checkbox",
        onChange: (e) => {
          if (value) {
            setValue(false);
            onValueChange(false);
          } else if (value === null || !allowIndeterminate) {
            setValue(true);
            onValueChange(true);
          } else {
            setValue(null);
            onValueChange(null);
          }
        }
      }
    ) })
  ] });
}

/*! pages/projects/components/filter-dropdown.tsx [vike:pluginModuleBanner] */
function FilterDropdown({
  label,
  onValueChange,
  options,
  defaultValue,
  multiple
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: label + "-dropdown", children: label }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "select",
      {
        id: label + "-dropdown",
        onChange: (e) => {
          if (multiple) {
            onValueChange(
              Array.from(e.target.selectedOptions).map((o) => o.value)
            );
          } else {
            onValueChange(e.target.value);
          }
        },
        defaultValue,
        multiple,
        style: {
          width: "100%"
        },
        children: options.map((option) => {
          if (typeof option === "string") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: option, children: option }, option);
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: option.value, children: option.label }, option.value);
        })
      }
    ) })
  ] });
}

/*! pages/projects/components/filter-bar.module.scss [vike:pluginModuleBanner] */
const styles = {
	"filter-table": "_filter-table_1ahjp_2"
};

/*! pages/projects/components/filter-bar.tsx [vike:pluginModuleBanner] */
function SearchFilter({
  onSetFilter,
  filter: { initialValue, id }
}) {
  const [state, setState] = reactExports.useState(initialValue);
  reactExports.useEffect(() => {
    if (state) {
      onSetFilter(
        id,
        (p) => p.repo.toLowerCase().includes(state.toLowerCase())
      );
    } else {
      onSetFilter(id, () => true);
    }
  }, [state, onSetFilter, id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FilterSearch,
    {
      onSearch: (v) => {
        setState(v);
      }
    }
  );
}
function LanguageFilter({
  onSetFilter,
  context,
  filter
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FilterDropdown,
    {
      label: "Language",
      onValueChange: (v) => {
        onSetFilter(filter.id, (p) => v.every((l) => p.languages?.[l]));
      },
      options: context.allLanguages,
      multiple: true
    }
  );
}
function LiveSiteFilter({
  onSetFilter,
  filter: { id, initialValue }
}) {
  const [state, setState] = reactExports.useState(initialValue);
  reactExports.useEffect(() => {
    if (state) {
      onSetFilter(id, (p) => !!p.deployment);
    } else {
      onSetFilter(id, (p) => !p.deployment);
    }
  }, [state, onSetFilter, id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FilterCheckbox,
    {
      label: "Live site?",
      defaultValue: true,
      onValueChange: (v) => {
        setState(v);
      }
    }
  );
}
function PublishedPackagesFilter({
  onSetFilter,
  filter: { id, initialValue }
}) {
  const [state, setState] = reactExports.useState(initialValue);
  reactExports.useEffect(() => {
    if (state) {
      onSetFilter(id, (p) => Object.keys(p.publishedPackages ?? {}).length > 0);
    } else {
      onSetFilter(
        id,
        (p) => Object.keys(p.publishedPackages ?? {}).length === 0
      );
    }
  }, [state, onSetFilter, id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FilterCheckbox,
    {
      label: "Published Packages?",
      defaultValue: true,
      onValueChange: (v) => {
        setState(v);
      }
    }
  );
}
const ALL_FILTERS = [
  { id: "search", component: SearchFilter },
  { id: "language", component: LanguageFilter },
  { id: "live-site", component: LiveSiteFilter, initialValue: true },
  {
    id: "published-packages",
    component: PublishedPackagesFilter,
    initialValue: true
  }
];
const DEFAULT_FILTERS = [ALL_FILTERS[0]];
function FilterBar({
  onSetFilter,
  onSetSort,
  repos
}) {
  const languages = reactExports.useMemo(
    () => [...new Set(repos.flatMap((r) => Object.keys(r.languages ?? {})))],
    [repos]
  );
  const [filterById] = reactExports.useState(/* @__PURE__ */ new Map());
  const [filters, setFilters] = reactExports.useState(
    new Map(DEFAULT_FILTERS.map((f) => [f.id, f]))
  );
  const [availableFilters, setAvailableFilters] = reactExports.useState([]);
  const setFilterFn = reactExports.useCallback(
    (id, filterFn) => {
      filterById.set(id, filterFn);
      onSetFilter(aggregateFilters(filterById));
    },
    [filterById, onSetFilter]
  );
  reactExports.useEffect(() => {
    setAvailableFilters(ALL_FILTERS.filter((f) => !filters.has(f.id)));
    onSetFilter(aggregateFilters(filterById));
  }, [filters, onSetFilter, filterById]);
  function removeFilter(id) {
    setFilters((f) => {
      f.delete(id);
      return new Map(f);
    });
  }
  function addFilter(filter) {
    setFilters((f) => {
      f.set(filter.id, filter);
      return new Map(f);
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: styles["filter-table"], children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
    Array.from(filters.values()).map((filter) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          title: "Remove filter",
          onClick: () => {
            filterById.delete(filter.id);
            removeFilter(filter.id);
            onSetFilter(aggregateFilters(filterById));
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(IoClose, {})
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        filter.component,
        {
          onSetFilter: setFilterFn,
          context: { repos, allLanguages: languages },
          filter
        }
      )
    ] }, filter.id)),
    availableFilters.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 3, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "select",
      {
        style: { width: "100%" },
        value: "",
        onChange: (e) => {
          const selectedFilterId = e.target.value;
          const selectedFilter = availableFilters.find(
            (filter) => filter.id === selectedFilterId
          );
          if (selectedFilter) {
            addFilter(selectedFilter);
          }
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", disabled: true, children: "Add Filter" }),
          availableFilters.map((filter) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: filter.id, children: filter.id }, filter.id))
        ]
      }
    ) }) }) : null
  ] }) });
}
function aggregateFilters(filters) {
  return (p) => {
    for (const filter of filters.values()) {
      if (!filter(p)) {
        return false;
      }
    }
    return true;
  };
}

/*! pages/projects/components/percent-bar.module.scss [vike:pluginModuleBanner] */
const classes = {
	"percent-bar-fill": "_percent-bar-fill_o5nz1_1",
	"percent-bar-label": "_percent-bar-label_o5nz1_9",
	"percent-bar": "_percent-bar_o5nz1_1"
};

/*! pages/projects/components/percent-bar.tsx [vike:pluginModuleBanner] */
function PercentBar({
  percent,
  label,
  color
}) {
  const [hasBeenVisible, setHasBeenVisible] = reactExports.useState(false);
  const el = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!el.current || hasBeenVisible) {
      return;
    }
    const instance = new IntersectionObserver(
      ([entry]) => {
        setHasBeenVisible(entry.isIntersecting);
      },
      {
        threshold: 1,
        root: null,
        rootMargin: "0px"
      }
    );
    instance.observe(el.current);
    return () => {
      instance.disconnect();
    };
  }, [el, hasBeenVisible]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: classes["percent-bar"], ref: el, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: classes["percent-bar-fill"],
      style: {
        width: hasBeenVisible ? `${percent}%` : 0,
        ...color ? { backgroundColor: color } : {}
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: classes["percent-bar-label"], children: percent + "%" })
    }
  ) });
}

/*! /home/runner/work/craigory-dev/craigory-dev/libs/date-utils/src/lib/formatted-date.tsx [vike:pluginModuleBanner] */
function FormattedDate({
  date,
  format: format$1
}) {
  const [formattedDate, setFormattedDate] = reactExports.useState();
  reactExports.useEffect(() => {
    setFormattedDate(format(date, format$1));
  }, [date]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: formattedDate ?? date });
}

/*! pages/projects/+Page.tsx [vike:pluginModuleBanner] */
function Page() {
  const { projects } = useData();
  const [filterFn, setFilterFn] = reactExports.useState(
    null
  );
  const [filteredProjects, setFilteredProjects] = reactExports.useState(projects);
  const [sortFn, setSortFn] = reactExports.useState(() => calculateRelevance);
  const [sortedProjects, setSortedProjects] = reactExports.useState(() => {
    const fn = sortFn(projects);
    return filteredProjects.sort(fn);
  });
  reactExports.useEffect(() => {
    setFilteredProjects(
      filterFn ? projects.filter((p) => filterFn(p)) : projects
    );
  }, [filterFn, projects]);
  reactExports.useEffect(() => {
    if (filteredProjects) {
      const fn = sortFn(filteredProjects);
      setSortedProjects(filteredProjects.sort(fn));
    }
  }, [filteredProjects, sortFn]);
  const onSetFilter = reactExports.useCallback(
    (fn) => {
      setFilterFn(() => fn);
    },
    [setFilterFn]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: "Projects" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FilterBar,
      {
        onSetFilter,
        repos: projects,
        onSetSort: setSortFn
      }
    ),
    sortedProjects.map((p, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: `#${p.repo}`,
            style: {
              // position: 'absolute',
              fontSize: "2rem",
              textDecoration: "none",
              color: "darkgray",
              // left: '-3.5rem',
              // top: '1.75rem',
              marginLeft: "-3.5rem",
              marginRight: "calc(3.5rem - 1ch)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ContentMarker, {})
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "h2",
          {
            id: p.repo,
            style: {
              display: "inline-block"
            },
            children: p.repo
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: p.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("th", { colSpan: 2, children: "Project Info" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                FaGithub,
                {
                  style: {
                    fontSize: "1.5rem",
                    verticalAlign: "middle",
                    marginRight: "0.5rem"
                  }
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Source URL" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: p.url, target: "_blank", rel: "noreferrer", children: "type" in p && p.type === "github" ? p.data.full_name : p.repo }) })
          ] }),
          p.deployment ? /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FaGlobe,
                {
                  style: {
                    fontSize: "1.5rem",
                    verticalAlign: "middle",
                    marginRight: "0.5rem"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Live URL" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeploymentLink, { project: p }) }) })
          ] }) : null,
          p.stars ? /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FaStar,
                {
                  style: {
                    fontSize: "1.5rem",
                    verticalAlign: "middle",
                    marginRight: "0.5rem"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Stars" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: p.stars })
          ] }) : null,
          p.lastCommit ? /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FaCalendar,
                {
                  style: {
                    fontSize: "1.5rem",
                    verticalAlign: "middle",
                    marginRight: "0.5rem"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Last Commit" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(FormattedDate, { date: p.lastCommit, format: "MMM do yyyy" }) })
          ] }) : null
        ] }),
        p.languages ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("thead", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("th", { colSpan: 2, children: "Languages Used" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Language" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "%" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: Object.entries(p.languages).sort(([, a], [, b]) => b - a).map(([name, percent]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: getLanguageLogo(name) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: name })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              PercentBar,
              {
                percent,
                label: percent.toFixed(2)
              }
            ) })
          ] }, name)) })
        ] }) : null,
        Object.keys(p.publishedPackages ?? {}).length ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("thead", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("th", { colSpan: 2, children: "Published Packages" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Package" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Weekly Downloads" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: Object.entries(p.publishedPackages ?? {}).sort(([, a], [, b]) => b.downloads - a.downloads).map(([name, { url, downloads, registry }]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: url, target: "_blank", rel: "noreferrer", children: [
              registry === "npm" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontSize: "1.5rem",
                    verticalAlign: "middle",
                    marginRight: "0.5rem"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(DiNpm, {})
                }
              ) : null,
              " ",
              name
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: downloads })
          ] }, name)) })
        ] }) : null
      ] }),
      idx < projects.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("hr", {}) : null
    ] }, p.repo))
  ] });
}
const calculateRelevance = (projects) => {
  const relevanceMap = /* @__PURE__ */ new Map();
  for (const project of projects) {
    relevanceMap.set(project.repo, calculateRelevanceForProject(project));
  }
  return (a, b) => {
    return relevanceMap.get(b.repo) ?? 0 - (relevanceMap.get(a.repo) ?? 0);
  };
};
function DeploymentLink({ project }) {
  const [displayName, setDisplayName] = reactExports.useState(project.deployment);
  reactExports.useEffect(() => {
    if (!project.deployment) return;
    try {
      const url = project.deployment.startsWith("/") ? new URL(project.deployment, window.location.origin) : project.deployment;
      setDisplayName(url.toString());
    } catch {
      setDisplayName(project.deployment);
    }
  }, [project.deployment]);
  if (!project.deployment) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: project.deployment, target: "_blank", rel: "noreferrer", children: displayName });
}
function calculateRelevanceForProject(p) {
  const stars = p.stars ?? 0;
  const downloads = Object.values(p.publishedPackages ?? {}).reduce(
    (acc, { downloads: downloads2 }) => acc + downloads2,
    0
  );
  const lastCommit = differenceInDays(/* @__PURE__ */ new Date(), new Date(p.lastCommit ?? ""));
  return stars + downloads / 100 + 100 / lastCommit;
}

const import2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Page
}, Symbol.toStringTag, { value: 'Module' }));

/*! pages/projects/+Layout.tsx [vike:pluginModuleBanner] */
function Layout({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        width: "100%"
      },
      children
    }
  );
}

const import3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  Layout
}, Symbol.toStringTag, { value: 'Module' }));

/*! virtual:vike:page-entry:client:/pages/projects [vike:pluginModuleBanner] */
const configValuesSerialized = {
  ["serverOnlyHooks"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: true,
    },
  },
  ["isClientRuntimeLoaded"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: true,
    },
  },
  ["onBeforeRenderEnv"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: null,
    },
  },
  ["dataEnv"]: {
    type: "computed",
    definedAtData: null,
    valueSerialized: {
      type: "js-serialized",
      value: {"server":true},
    },
  },
  ["onRenderClient"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/__internal/integration/onRenderClient","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "pointer-import",
      value: onRenderClient,
    },
  },
  ["Page"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"/pages/projects/+Page.tsx","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "plus-file",
      exportValues: import2,
    },
  },
  ["hydrationCanBeAborted"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/config","fileExportPathToShowToUser":["default","hydrationCanBeAborted"]},
    valueSerialized: {
      type: "js-serialized",
      value: true,
    },
  },
  ["Layout"]: {
    type: "cumulative",
    definedAtData: [{"filePathToShowToUser":"/pages/projects/+Layout.tsx","fileExportPathToShowToUser":[]},{"filePathToShowToUser":"/renderer/+Layout.tsx","fileExportPathToShowToUser":[]}],
    valueSerialized: [ {
      type: "plus-file",
      exportValues: import3,
    }, {
      type: "plus-file",
      exportValues: import3$1,
    }, ],
  },
  ["title"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"/renderer/+config.ts","fileExportPathToShowToUser":["default","title"]},
    valueSerialized: {
      type: "js-serialized",
      value: "Craigory Coppola",
    },
  },
  ["Loading"]: {
    type: "standard",
    definedAtData: {"filePathToShowToUser":"vike-react/__internal/integration/Loading","fileExportPathToShowToUser":[]},
    valueSerialized: {
      type: "pointer-import",
      value: import5,
    },
  },
};

export { configValuesSerialized };

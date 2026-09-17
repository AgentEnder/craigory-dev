import type { AudioFeatures } from '../../worker/types';
import { keyName } from '../../worker/reccobeats/parse';

/**
 * The audio-features section of the song page, from ReccoBeats.
 *
 * ## Form
 *
 * Two different jobs, so two different treatments — the most common way a panel
 * like this goes wrong is rendering all ten numbers as ten identical bars.
 *
 * - **Tempo, key and loudness are single headline values on unrelated scales**
 *   (BPM, a pitch name, dB). Each is a stat tile. A one-bar bar chart of a
 *   tempo would be nonsense: there is no domain to be a fraction of, and no
 *   other bar to compare it against.
 * - **The other seven share one 0–1 scale**, which is exactly the case bars are
 *   for: comparable magnitudes, read against each other at a glance.
 *
 * ## Colour
 *
 * One hue for every bar, because there is one series here. Colour would be
 * carrying identity if each bar were a different song; it is not, so a second
 * hue would encode nothing and cost the reader a lookup.
 *
 * That hue is ink rather than the app's accent on purpose. `styles.css`
 * reserves the single accent for playback, precisely so a teal control always
 * means "this plays" — spending it on data bars would blur that, and audio
 * features are not playback and not a platform. The unfilled track is a lighter
 * step of the same neutral ramp, so a bar reads across its whole length.
 *
 * ## Accessibility
 *
 * Every value is present as text, so the bar is decoration and is hidden from
 * assistive tech: a screen reader gets "Energy 84%", not a meter widget it has
 * to interpret. That also means the panel is its own table view — there is no
 * value here reachable only by looking at a rectangle.
 */

/** A 0–1 measure: its label, and what it actually means in plain words. */
const UNIT_FEATURES: {
  key: keyof AudioFeatures;
  label: string;
  hint: string;
}[] = [
  {
    key: 'energy',
    label: 'Energy',
    hint: 'Intensity and activity — fast, loud and noisy scores high.',
  },
  {
    key: 'danceability',
    label: 'Danceability',
    hint: 'How suited the track is to dancing, from tempo, rhythm and beat strength.',
  },
  {
    key: 'valence',
    label: 'Valence',
    hint: 'Musical positivity — high sounds happy or euphoric, low sounds sad or angry.',
  },
  {
    key: 'acousticness',
    label: 'Acousticness',
    hint: 'Confidence that the recording is acoustic rather than electric or produced.',
  },
  {
    key: 'instrumentalness',
    label: 'Instrumentalness',
    hint: 'Confidence that the track has no vocals. Spoken word scores low, not high.',
  },
  {
    key: 'liveness',
    label: 'Liveness',
    hint: 'Confidence the recording has an audience — that it was performed live.',
  },
  {
    key: 'speechiness',
    label: 'Speechiness',
    hint: 'Presence of spoken words. A podcast scores high, a sung melody low.',
  },
];

function percent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/** Label + value + bar. The bar restates the value; the text carries it. */
function FeatureBar({
  label,
  hint,
  value,
}: {
  label: string;
  hint: string;
  value: number;
}) {
  return (
    <li className="flex items-center gap-3" title={hint}>
      <span className="w-32 shrink-0 text-xs text-gray-600">{label}</span>
      {/* Track and fill: 6px is well under the 24px mark cap, and the fill is
          square at the zero baseline and rounded only at the data end, so the
          bar cannot read as floating free of its origin. */}
      <span
        aria-hidden="true"
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100" // unslop-ignore — track by role
      >
        {/* A floor keeps a small-but-real value visible, but only above zero:
            a stub of ink on a 0% row reads as "a little bit", which is the one
            thing the number beside it says it is not. */}
        <span
          className="block h-full rounded-r-[4px] bg-ink"
          style={{ width: value === 0 ? '0%' : `${Math.max(value * 100, 1.5)}%` }}
        />
      </span>
      <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums text-ink">
        {percent(value)}
      </span>
    </li>
  );
}

/**
 * One headline number. Proportional figures rather than `tabular-nums`: these
 * do not align in a column with anything, and equal-width digits make a short
 * value look loose at this size.
 */
function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-2.5">
      <dt className="text-[11px] uppercase tracking-wider text-gray-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-base font-semibold text-ink sm:text-lg">
        {value}
      </dd>
    </div>
  );
}

export function AudioFeaturePanel({
  features,
  className,
}: {
  features: AudioFeatures;
  className?: string;
}) {
  const tiles: { label: string; value: string }[] = [];
  if (features.tempo !== undefined) {
    tiles.push({ label: 'Tempo', value: `${Math.round(features.tempo)} BPM` });
  }
  const key = keyName(features);
  if (key) tiles.push({ label: 'Key', value: key });
  if (features.loudness !== undefined) {
    tiles.push({
      label: 'Loudness',
      value: `${features.loudness.toFixed(1)} dB`,
    });
  }

  const bars = UNIT_FEATURES.flatMap((feature) => {
    const value = features[feature.key];
    return typeof value === 'number'
      ? [{ ...feature, value }]
      : [];
  });

  // ReccoBeats knowing the track but returning nothing usable is possible, and
  // an empty "Audio features" heading is worse than no heading.
  if (tiles.length === 0 && bars.length === 0) return null;

  return (
    <section className={className} aria-label="Audio features">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Audio features
      </h2>

      {/* Always three columns, even for one tile. Sizing the grid to the number
          of tiles stretches a lone "98 BPM" across the whole card, which reads
          as a headline rather than one fact among several. */}
      {tiles.length > 0 && (
        <dl className="mt-3 grid grid-cols-3 gap-2">
          {tiles.map((tile) => (
            <StatTile key={tile.label} label={tile.label} value={tile.value} />
          ))}
        </dl>
      )}

      {bars.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2.5">
          {bars.map((bar) => (
            <FeatureBar
              key={bar.key}
              label={bar.label}
              hint={bar.hint}
              value={bar.value}
            />
          ))}
        </ul>
      )}

      {/* Attribution is not decoration here: these are ReccoBeats' own
          estimates, not Spotify's retired numbers, and a reader comparing them
          against a figure from elsewhere needs to know whose they are. */}
      <p className="mt-3 text-[11px] text-gray-400">
        Estimated by{' '}
        <a
          href="https://reccobeats.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          ReccoBeats
        </a>
        , which fills the gap Spotify left when it retired its audio-features API.
      </p>
    </section>
  );
}

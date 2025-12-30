import { useState, useMemo } from 'react';
import classes from './tiki-table.module.scss';
import { LinkToPost } from './link-to-post';

/**
 * Data Type for a row in the Tiki Rating table.
 */
export type TikiRating = {
  /**
   * The name of the bar being rated.
   */
  bar: string;

  /**
   * The Google Maps link for the bar.
   */
  googleMapsLink: string;

  /**
   * The blog slug for the bar.
   */
  blogSlug: string | null;

  /**
   * The location of the bar, used as a display value for the maps link.
   */
  location: string;

  /**
   * Short description of the bar.
   */
  description: string;

  /**
   * Overall rating for the bar.
   */
  overall?: number;

  /**
   * Food rating for the bar.
   */
  food?: number;

  /**
   * Drinks rating for the bar.
   */
  drinks?: number;

  /**
   * Decor rating for the bar.
   */
  decor?: number;

  visits: Date[];
};

const DATA: TikiRating[] = [
  {
    bar: 'Pineapple Parlor',
    blogSlug: 'pineapple-parlor',
    googleMapsLink: 'https://maps.app.goo.gl/kFvBPXxiWxJJchm56',
    location: 'Galveston, TX',
    description:
      'Tiki speakeasy, be sure to find the entry code before coming.',
    overall: 4.5,
    food: 5.0,
    drinks: 4.0,
    decor: 4.0,
    visits: [new Date('2025-05-25')],
  },
  {
    bar: 'The Inferno Room',
    blogSlug: 'inferno-room',
    googleMapsLink: 'https://maps.app.goo.gl/SD9mU6XEH7ggPBcF8',
    location: 'Indianapolis, IN',
    description: 'A fiery tiki bar with a unique cocktail menu.',
    overall: 4.0,
    food: 4,
    drinks: 4.5,
    decor: 5,
    visits: [new Date('2025-08-01')],
  },
  {
    bar: 'Trader Sam’s Grog Grotto',
    blogSlug: 'trader-sams-grog-grotto',
    googleMapsLink: 'https://maps.app.goo.gl/boJGqCEg6evwyqYe8',
    location: 'Lake Buena Vista, FL',
    description:
      'A world class tiki bar, nestled inside Disney’s Polynesian Village Resort.',
    overall: 4.5,
    drinks: 4.5,
    decor: 5.0,
    visits: [new Date('2025-03-13')],
  },
  {
    bar: 'Tiki Chick',
    blogSlug: 'tiki-chick',
    googleMapsLink: 'https://maps.app.goo.gl/DchFxZdhoeCowypz8',
    location: 'NYC, NY',
    description:
      'Less heavily themed tiki bar with excellent drinks, creative seating, and $5 chicken sandwiches',
    overall: 3.5,
    drinks: 4.0,
    decor: 2.0,
    food: 4.0,
    visits: [new Date('2023-09-29'), new Date('2025-12-05')],
  },
  {
    bar: 'The Kaona Room',
    blogSlug: 'kaona-room',
    googleMapsLink: 'https://maps.app.goo.gl/dtHnXSvbzPCkR9CQ7',
    location: 'Miami, FL',
    description:
      'An unusual visit makes a real rating inappropriate, see blog.',
    decor: 3.5,
    visits: [new Date('2023-10-01')],
  },
  {
    bar: 'Kon Tiki',
    blogSlug: 'kon-tiki',
    googleMapsLink: 'https://maps.app.goo.gl/d8YEchnt9VeX5YJr9',
    location: 'Kansas City, MO',
    description:
      'A vibrant tiki bar with a lively atmosphere and creative cocktails.',
    overall: 3.5,
    drinks: 4.0,
    decor: 3.0,
    visits: [new Date('2025-08-15')],
  },
  {
    bar: 'Rum Barrel West',
    blogSlug: 'rum-barrel-west',
    googleMapsLink: 'https://maps.app.goo.gl/TnSh4sji1B8xiQEe7',
    location: 'Amsterdam, NL',
    description: 'A cozy rum bar with a great selection of cocktails and rums.',
    overall: 3.5,
    food: 3.0,
    drinks: 4.0,
    decor: 1.5,
    visits: [new Date('2025-08-20')],
  },
  {
    bar: 'Sunken Harbor Club',
    blogSlug: 'sunken-harbor-club',
    googleMapsLink: 'https://maps.app.goo.gl/nKXh4pAKP57gBtqq5',
    location: 'Brooklyn, NY',
    description:
      'A nautical themed tiki bar located above Gage and Tollner in Brooklyn, NY.',
    overall: 4.5,
    food: 4.5,
    drinks: 4.5,
    decor: 4.0,
    visits: [new Date('2025-12-06')],
  },
  {
    bar: 'Paradise Lost',
    blogSlug: 'paradise-lost',
    googleMapsLink: 'https://maps.app.goo.gl/d5BQGcLvhUeMrEtW6',
    location: 'East Village, NYC, NY',
    description: 'A tiki speakeasy located in the East Village, NYC.',
    overall: 3,
    drinks: 4,
    decor: 3,
    visits: [new Date('2025-12-06')],
  },
];

type SortKey = 'bar' | 'location' | 'overall' | 'food' | 'drinks' | 'decor';
type SortDirection = 'asc' | 'desc';

interface TikiTableProps {
  ratings: TikiRating[];
}

function StarRating({
  rating,
  maxRating = 5,
}: {
  rating: number;
  maxRating?: number;
}) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={`full-${i}`} className={classes['star']}>
        ★
      </span>
    );
  }

  if (hasHalfStar && fullStars < maxRating) {
    stars.push(
      <span key="half" className={classes['halfStar']}>
        ★
      </span>
    );
  }

  const emptyStars = maxRating - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <span key={`empty-${i}`} className={classes['emptyStar']}>
        ☆
      </span>
    );
  }

  return (
    <div className={classes['starRating']}>
      <span className={classes['stars']}>{stars}</span>
      <span className={classes['ratingValue']}>{rating.toFixed(1)}</span>
    </div>
  );
}

export function TikiTable({ ratings }: TikiTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('overall');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const sortedRatings = useMemo(() => {
    const sorted = [...(ratings ?? DATA)].sort((a, b) => {
      let aValue: string | number | undefined;
      let bValue: string | number | undefined;

      switch (sortKey) {
        case 'bar':
        case 'location':
          aValue = a[sortKey].toLowerCase();
          bValue = b[sortKey].toLowerCase();
          break;
        case 'food':
          aValue = a.food ?? 0;
          bValue = b.food ?? 0;
          break;
        default:
          aValue = a[sortKey] ?? 0;
          bValue = b[sortKey] ?? 0;
      }

      if (aValue === undefined || bValue === undefined) return 0;

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [ratings, sortKey, sortDirection]);

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={classes['tableContainer']}>
      <table className={classes['tikiTable']}>
        <thead>
          <tr>
            <th
              onClick={() => handleSort('bar')}
              className={classes['sortable']}
            >
              Bar Name {getSortIcon('bar')}
            </th>
            <th
              onClick={() => handleSort('location')}
              className={classes['sortable']}
            >
              Location {getSortIcon('location')}
            </th>
            {/* <th>Description</th> */}
            <th
              onClick={() => handleSort('overall')}
              className={classes['sortable']}
            >
              Overall {getSortIcon('overall')}
            </th>
            <th
              onClick={() => handleSort('food')}
              className={classes['sortable']}
            >
              Food {getSortIcon('food')}
            </th>
            <th
              onClick={() => handleSort('drinks')}
              className={classes['sortable']}
            >
              Drinks {getSortIcon('drinks')}
            </th>
            <th
              onClick={() => handleSort('decor')}
              className={classes['sortable']}
            >
              Decor {getSortIcon('decor')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRatings.map((rating, index) => (
            <tr key={`${rating.bar}-${index}`}>
              <td className={classes['barName']}>
                {rating.blogSlug ? (
                  <LinkToPost slug={rating.blogSlug} title={rating.bar} />
                ) : (
                  rating.bar
                )}
              </td>
              <td>
                {rating.googleMapsLink ? (
                  <a
                    href={rating.googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classes['mapLink']}
                  >
                    {rating.location}
                  </a>
                ) : (
                  <span className={classes['na']}>{rating.location}</span>
                )}
              </td>
              {/* <td className={classes['description']}>{rating.description}</td> */}
              <RatingCell rating={rating.overall} />
              <RatingCell rating={rating.food} />
              <RatingCell rating={rating.drinks} />
              <RatingCell rating={rating.decor} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RatingCell({ rating }: { rating?: number }) {
  return (
    <td className={classes['ratingColumn']}>
      {rating === undefined ? (
        <span className={classes['na']}>N/A</span>
      ) : (
        <StarRating rating={rating} />
      )}
    </td>
  );
}

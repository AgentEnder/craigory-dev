import { format as dateFnsFormat } from 'date-fns';
import { useEffect, useState } from 'react';

export function FormattedDate({
  date,
  format,
}: {
  date: string;
  format: string;
}) {
  const [formattedDate, setFormattedDate] = useState<string | undefined>();

  useEffect(() => {
    setFormattedDate(dateFnsFormat(date, format));
  }, [date]);

  return <>{formattedDate ?? date}</>;
}

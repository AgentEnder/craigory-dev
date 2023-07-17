import thatConfWi2023 from './metadata/that-conf-wi-2023';
import thatConfTx2023 from './metadata/that-conf-tx-2023';
import nxConf2021 from './metadata/nx-conf-2021';
import nxConfLite2022 from './metadata/nx-conf-lite-2022';
import devup2023 from './metadata/devup-2023';

export type Presentation = {
  mdUrl?: string;
  recordingUrl?: string;
  title: string;
  description: string;
  presentedAt: string;
  presentedOn: Date;
};

export const PRESENTATIONS: Presentation[] = [
  thatConfWi2023,
  thatConfTx2023,
  nxConf2021,
  nxConfLite2022,
  ...devup2023
].sort((a, b) => b.presentedOn.getTime() - a.presentedOn.getTime());

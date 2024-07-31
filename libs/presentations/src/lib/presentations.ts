import thatConfWi2023 from '../presentation-data/that-conf-wi-2023-benchmarking';
import thatConfTx2023 from '../presentation-data/that-conf-tx-2023-full-stack-type-safety';
import nxConf2021 from '../presentation-data/nx-conf-2021-nx-for-your-stack';
import nxConfLite2022 from '../presentation-data/nx-conf-lite-2022-progressive-enhancement';
import devup2023FSTS from '../presentation-data/devup-2023-full-stack-type-safety';
import devup2023Benchmarking from '../presentation-data/devup-2023-benchmarking';
import nxConf2023 from '../presentation-data/nx-conf-2023-inference';
import thatTx2024 from '../presentation-data/that-conf-tx-2024-compartmentalization';
import launchNxConf2024CrystalDotnet from '../presentation-data/nx-conf-2024-crystal-dotnet';
import thatWi2024 from '../presentation-data/that-conf-wi-2024-spaghetti';

export type Presentation = {
  mdUrl?: string;
  scssUrl?: string;
  htmlUrl?: string;
  recordingUrl?: string;
  extraLinks?: { url: string; title: string }[];

  title: string;
  description: string;
  presentedAt: string;
  presentedOn: Date;
  slug: string;
};

export const PRESENTATIONS: Record<string, Presentation> = [
  thatConfWi2023,
  thatConfTx2023,
  nxConf2021,
  nxConfLite2022,
  devup2023Benchmarking,
  devup2023FSTS,
  nxConf2023,
  thatTx2024,
  launchNxConf2024CrystalDotnet,
  thatWi2024,
]
  .sort((a, b) => b.presentedOn.getTime() - a.presentedOn.getTime())
  .reduce((acc, cur) => {
    if (cur.slug in acc) {
      throw new Error(
        'Multiple presentations should not have the same slug:' + cur.slug
      );
    }
    acc[cur.slug] = cur;
    return acc;
  }, {} as Record<string, Presentation>);

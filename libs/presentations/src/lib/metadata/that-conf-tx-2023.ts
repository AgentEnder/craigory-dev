import { Presentation } from '../presentations';

const presentation: Presentation = {
  title: 'Full Stack Type Safety Across Languages',
  description: `One of the benefits many companies see in monorepos is that you can share interfaces across your front-end and back-end code. Sharing interfaces enables you to create bulletproof API layers on the web but requires that your back end is also in JS.\n  This chat will introduce Nx to facilitate the conversation and use .NET and Angular as the driving example. Knowledge of the three technologies is optional, though; the tools will only be introduced enough to understand what is needed. All knowledge introduced should be transferrable to other tools.\nWe can take advantage of build pipelines and dependencies to ensure that accurate typings are generated for our front end before the typescript build, and introducing caching prevents any of the slowdowns that folks may be accustomed to with some older monorepo solutions.\nThe second half of the session will guide attendees in setting this up on their local machine, so that they can more thoroughly interact with it.`,
  presentedAt: 'THAT Conference TX (2023)',
  presentedOn: new Date(2023, 0, 17),
};

export default presentation;

import { Presentation } from '../presentations';

const presentations: Presentation[] = [{
  title: "Benchmarking like a Scientist: Communicating Code's Performance.",
  description: `As software developers, it's not enough to simply write efficient code - we need to be able to communicate its performance effectively too. That's where benchmarking comes in. In this session, we'll dive into benchmarking, examining the different approaches and tools available for measuring the performance of your code. From micro to macro and synthetic benchmarking, we'll cover best practices and common pitfalls to avoid. We'll also delve into the crucial aspect of communication - how to present your benchmark results in a clear and concise manner, so that they can be easily understood by both technical and non-technical stakeholders. Whether you're a seasoned developer or new to the field, this talk will give you the skills and knowledge you need to effectively benchmark your code and communicate its performance.`,
  presentedAt: 'Devup (2023)',
  presentedOn: new Date(2023, 7, 28),
},{
  title: "Full Stack Type Safety Across Languages",
  description: `Explore how type safety can transcend language barriers, and how you can combine your front-end and back-end code into a killer monorepo with Nx, .NET, and Angular. Using openapi extraction and code generation, we will explore how changing an interface in the backend can trigger build time failures for your front end, and exactly why that is a good thing anyways.\nThe driving example will utilize C# and ASP.NET Core, with Angular for the front end. Alternative commands will be provided for react, but both the front end and back end can be swapped out for nearly any tool that you may want to use`,
  presentedAt: 'Devup (2023)',
  presentedOn: new Date(2023, 7, 28),
}];

export default presentations;

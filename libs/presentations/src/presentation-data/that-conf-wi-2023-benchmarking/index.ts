import { Presentation } from '../../lib/presentations';

const presentation: Presentation = {
  title: "Benchmarking like a Scientist: Communicating Code's Performance.",
  description: `This session will explore several aspects of benchmarking. We will start by introducing the concept of code benchmarking, what it is and why it is important in software development. We will then cover the different approaches to benchmarking, including micro, macro, and synthetic benchmarking, and examine the pros and cons of each method.\nNext, we will delve into the best practices of benchmarking and the common pitfalls to avoid. This will include topics such as selecting the right metrics, avoiding bias in your benchmark results, and controlling environmental factors to ensure repeatability and reproducibility. We will also discuss the importance of benchmarking throughout the development process, and how it can be used to inform design decisions and optimize code.        In addition to the technical aspects of benchmarking, we will also be focusing on the crucial aspect of communication. We will cover how to present your benchmark results in a clear and concise manner, so that they can be easily understood by both technical and non-technical stakeholders. This includes best practices for visualizing your results, and tips for effectively communicating the performance of your code.\nThis session is aimed at developers of all levels, from those new to the field to experienced professionals. Whether you are looking to improve your benchmarking skills, or simply want to gain a deeper understanding of the science behind code performance, this session will provide you with the knowledge and tools you need to succeed.`,
  presentedAt: 'THAT Conference WI',
  presentedOn: new Date(2023, 6, 27),
  mdUrl: 'slides',
  slug: 'that-conf-wi-2023-benchmarking',
  extraLinks: [
    {
      url: 'https://that.us/activities/WGucIjHEx8oacKVjMPac',
      title: 'THAT link',
    },
  ],
};

export default presentation;

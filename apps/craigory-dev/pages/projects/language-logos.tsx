import {
  SiTypescript,
  SiJavascript,
  SiCsharp,
  SiPython,
  SiCplusplus,
  SiCss3,
  SiMdx,
  SiHtml5,
  SiLua,
} from 'react-icons/si';
import { BsTerminalFill } from 'react-icons/bs';

export function getLanguageLogo(language: string) {
  switch (language) {
    case 'TypeScript':
      return (
        <SiTypescript
          style={{
            color: '#007acc',
            fontSize: '1.5rem',
            verticalAlign: 'middle',
            marginRight: '0.5rem',
          }}
        />
      );
    case 'JavaScript':
      return (
        <SiJavascript
          style={{
            color: '#f0db4f',
            fontSize: '1.5rem',
            verticalAlign: 'middle',
            marginRight: '0.5rem',
          }}
        />
      );
    case 'C#':
      return (
        <SiCsharp
          style={{
            color: '#239120',
            fontSize: '1.5rem',
            verticalAlign: 'middle',
            marginRight: '0.5rem',
          }}
        />
      );
    case 'Python':
      return (
        <SiPython
          style={{
            color: '#3776ab',
            fontSize: '1.5rem',
            verticalAlign: 'middle',
            marginRight: '0.5rem',
          }}
        />
      );

    case 'C++':
      return (
        <SiCplusplus
          style={{
            color: '#00599c',
            fontSize: '1.5rem',
            verticalAlign: 'middle',
            marginRight: '0.5rem',
          }}
        />
      );

    case 'SCSS':
    case 'CSS':
      return (
        <SiCss3
          style={{
            color: '#1572b6',
            fontSize: '1.5rem',
            verticalAlign: 'middle',
            marginRight: '0.5rem',
          }}
        />
      );

    case 'HTML':
      return (
        <SiHtml5
          style={{
            color: '#e34f26',
            fontSize: '1.5rem',
            verticalAlign: 'middle',
            marginRight: '0.5rem',
          }}
        />
      );

    case 'MDX':
      return (
        <SiMdx
          style={{
            color: '#f9ac00',
            fontSize: '1.5rem',
            verticalAlign: 'middle',
            marginRight: '0.5rem',
          }}
        />
      );

    case 'Shell':
      return (
        <BsTerminalFill
          style={{
            color: '#000000',
            fontSize: '1.5rem',
            verticalAlign: 'middle',
            marginRight: '0.5rem',
          }}
        />
      );

    case 'Lua':
      return (
        <SiLua
          style={{
            color: '#000080',
            fontSize: '1.5rem',
            verticalAlign: 'middle',
            marginRight: '0.5rem',
          }}
        />
      );

    default:
      console.log(`No icon for language: ${language}`);
      return null;
  }
}

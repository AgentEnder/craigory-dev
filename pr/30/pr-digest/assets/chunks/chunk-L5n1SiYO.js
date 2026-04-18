import{r as O,a as S}from"./chunk-BU6aLKHA.js";function P(l,n){for(var a=0;a<n.length;a++){const t=n[a];if(typeof t!="string"&&!Array.isArray(t)){for(const s in t)if(s!=="default"&&!(s in l)){const p=Object.getOwnPropertyDescriptor(t,s);p&&Object.defineProperty(l,s,p.get?p:{enumerable:!0,get:()=>t[s]})}}}return Object.freeze(Object.defineProperty(l,Symbol.toStringTag,{value:"Module"}))}var c={},y;function j(){if(y)return c;y=1,Object.defineProperty(c,"__esModule",{value:!0}),c.bashCompletionScript=p,c.zshCompletionScript=h,c.fishCompletionScript=g,c.powershellCompletionScript=_,c.installCompletionScripts=b;const l=O,n=l.__importStar(S),a=l.__importStar(S),t=l.__importStar(S);function s(o){return o.replace(/[^a-zA-Z0-9_]/g,"_")}function p(o){const e=`_${s(o)}_completions`;return`${e}() {
  local cur_word args
  cur_word="\${COMP_WORDS[COMP_CWORD]}"
  args=("\${COMP_WORDS[@]:1:$COMP_CWORD}")

  local completions
  completions="$("${o}" --get-completions "\${args[@]}" 2>/dev/null)"

  COMPREPLY=($(compgen -W "$completions" -- "$cur_word"))
}
complete -F ${e} "${o}"`}function h(o){const e=`_${s(o)}_completions`;return`${e}() {
  local completions
  completions=("\${(@f)$("${o}" --get-completions "\${words[@]:1}" 2>/dev/null)}")
  compadd -- $completions
}
compdef ${e} "${o}"`}function g(o){return`complete -c "${o}" -f -a '("${o}" --get-completions (commandline -cop)[2..] 2>/dev/null)'`}function _(o){return`Register-ArgumentCompleter -CommandName "${o}" -ScriptBlock {
  param($wordToComplete, $commandAst, $cursorPosition)
  $args = $commandAst.ToString().Split() | Select-Object -Skip 1
  $completions = & "${o}" --get-completions @args 2>$null
  $completions -split '\\n' | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
  }
}`}function m(o,e,r,f,d=!1){const i=`# cli-forge completion for ${f}`;if(d)return n.writeFileSync(e,`${i}
${r}
`),{shell:o,file:e,action:"created"};if(!n.existsSync(e))return{shell:o,file:e,action:"skipped"};if(n.readFileSync(e,"utf-8").includes(i))return{shell:o,file:e,action:"skipped"};const $=`
${i}
${r}
${i} end
`;return n.appendFileSync(e,$),{shell:o,file:e,action:"appended"}}async function b(o){const e=a.homedir(),r=[],f=t.join(e,".bashrc");r.push(m("bash",f,p(o),o));const d=t.join(e,".zshrc");r.push(m("zsh",d,h(o),o));const i=t.join(e,".config","fish","completions"),C=t.join(i,`${o}.fish`);n.existsSync(t.join(e,".config","fish"))&&(n.existsSync(i)||n.mkdirSync(i,{recursive:!0}),r.push(m("fish",C,g(o),o,!0)));const $=t.join(e,"Documents","PowerShell","Microsoft.PowerShell_profile.ps1");n.existsSync(t.dirname($))&&r.push(m("PowerShell",$,_(o),o)),console.log("Shell completion installation results:");for(const u of r)console.log(`  ${u.shell}: ${u.action} (${u.file})`);r.every(u=>u.action==="skipped")?console.log(`
No shell config files detected. You can manually source the completion scripts.`):console.log(`
Restart your shell or source the updated config to enable completions.`)}return c}var w=j();const k=P({__proto__:null},[w]);export{k as c};

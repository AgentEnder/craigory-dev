import{g as f,a as $}from"./chunk-D0f8GXPK.js";import"../entries/pages_index.DPd0ohZZ.js";import"./chunk-O5L3rBtC.js";/* empty css              *//* empty css              */function a(o){return o.replace(/[^a-zA-Z0-9_]/g,"_")}function d(o){const n=`_${a(o)}_completions`;return`${n}() {
  local cur_word args
  cur_word="\${COMP_WORDS[COMP_CWORD]}"
  args=("\${COMP_WORDS[@]:1:$COMP_CWORD}")

  local completions
  completions="$("${o}" --get-completions "\${args[@]}" 2>/dev/null)"

  COMPREPLY=($(compgen -W "$completions" -- "$cur_word"))
}
complete -F ${n} "${o}"`}function h(o){const n=`_${a(o)}_completions`;return`${n}() {
  local completions
  completions=("\${(@f)$("${o}" --get-completions "\${words[@]:1}" 2>/dev/null)}")
  compadd -- $completions
}
compdef ${n} "${o}"`}function g(o){return`complete -c "${o}" -f -a '("${o}" --get-completions (commandline -cop)[2..] 2>/dev/null)'`}function S(o){return`Register-ArgumentCompleter -CommandName "${o}" -ScriptBlock {
  param($wordToComplete, $commandAst, $cursorPosition)
  $args = $commandAst.ToString().Split() | Select-Object -Skip 1
  $completions = & "${o}" --get-completions @args 2>$null
  $completions -split '\\n' | Where-Object { $_ -like "$wordToComplete*" } | ForEach-Object {
    [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', $_)
  }
}`}function p(o,n,c,t,e=!1){const s=$(),r=`# cli-forge completion for ${t}`;if(e)return s.writeFileSync(n,`${r}
${c}
`),{shell:o,file:n,action:"created"};if(!s.existsSync(n))return{shell:o,file:n,action:"skipped"};if(s.readFileSync(n).includes(r))return{shell:o,file:n,action:"skipped"};const i=`
${r}
${c}
${r} end
`;return s.appendFileSync(n,i),{shell:o,file:n,action:"appended"}}async function w(o){const n=$(),c=f(),t=c.getEnv("HOME")??c.getEnv("USERPROFILE")??"/",e=[],s=n.join(t,".bashrc");e.push(p("bash",s,d(o),o));const r=n.join(t,".zshrc");e.push(p("zsh",r,h(o),o));const i=n.join(t,".config","fish","completions"),u=n.join(i,`${o}.fish`);n.existsSync(n.join(t,".config","fish"))&&(n.existsSync(i)||n.mkdirSync(i,{recursive:!0}),e.push(p("fish",u,g(o),o,!0)));const m=n.join(t,"Documents","PowerShell","Microsoft.PowerShell_profile.ps1");n.existsSync(n.dirname(m))&&e.push(p("PowerShell",m,S(o),o)),console.log("Shell completion installation results:");for(const l of e)console.log(`  ${l.shell}: ${l.action} (${l.file})`);e.every(l=>l.action==="skipped")?console.log(`
No shell config files detected. You can manually source the completion scripts.`):console.log(`
Restart your shell or source the updated config to enable completions.`)}export{w as installCompletionScripts};

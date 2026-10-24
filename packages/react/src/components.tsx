import { useId, type ReactNode, type ComponentProps } from 'react';
import * as stylex from '@stylexjs/stylex';
import { Button as BaseButton } from '@base-ui/react/button';
import { Input } from '@base-ui/react/input';
import { Select as BaseSelect } from '@base-ui/react/select';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { StatusIcon } from './StatusIcon';

const s = stylex.create({
 button: { display:'inline-flex', alignItems:'center', justifyContent:'center', gap:10, minHeight:48, padding:'11px 20px', borderRadius:'var(--dp-radius-control)', borderWidth:1, borderStyle:'solid', fontFamily:'inherit', fontSize:14, fontWeight:600, lineHeight:1.4, cursor:'pointer', transition:'background-color var(--dp-duration-fast) var(--dp-ease-out), box-shadow var(--dp-duration-fast) var(--dp-ease-out), transform var(--dp-duration-fast) var(--dp-ease-out)', textDecoration:'none', ':active':{transform:'translateY(1px)'} },
 primary: { backgroundColor:{default:'var(--dp-orange)', ':hover':'var(--dp-orange-hover)', ':active':'var(--dp-orange-active)'}, color:'var(--dp-on-orange)', borderColor:'var(--dp-orange-border)', boxShadow:{default:'var(--dp-shadow-action)', ':hover':'var(--dp-shadow-action-hover)'} },
 secondary: { backgroundColor:{default:'var(--dp-surface)', ':hover':'var(--dp-hover)', ':active':'var(--dp-active)'}, color:'var(--dp-text)', borderColor:'var(--dp-divider)' },
 quiet: { backgroundColor:{default:'transparent', ':hover':'var(--dp-hover)', ':active':'var(--dp-active)'}, color:'var(--dp-text)', borderColor:'transparent' },
 buttonDisabled: { backgroundColor:{default:'var(--dp-surface)', ':hover':'var(--dp-surface)', ':active':'var(--dp-surface)'}, color:'var(--dp-muted)', borderColor:'var(--dp-divider)', boxShadow:'none', cursor:'not-allowed', ':active':{transform:'none'} },
 controlDisabled: { backgroundColor:{default:'var(--dp-field)', ':hover':'var(--dp-field)', ':active':'var(--dp-field)'}, color:'var(--dp-muted)', borderColor:'var(--dp-border)', cursor:'not-allowed' },
 disabled: { color:'var(--dp-muted)', cursor:'not-allowed' },
 field: { display:'flex', flexDirection:'column', gap:8, minWidth:0 },
 label: { fontSize:14, fontWeight:600, color:'var(--dp-text)' },
 input: { width:'100%', minHeight:48, padding:'11px 14px', backgroundColor:'var(--dp-field)', color:'var(--dp-text)', borderWidth:1, borderStyle:'solid', borderColor:{default:'var(--dp-border)', ':hover':'var(--dp-muted)'}, borderRadius:'var(--dp-radius-control)', fontFamily:'inherit', fontSize:16, lineHeight:1.5 },
 invalid: { borderColor:{default:'var(--dp-error)', ':hover':'var(--dp-error)'} },
 help: { fontSize:13, lineHeight:1.6, color:'var(--dp-muted)', margin:0 },
 error: { color:'var(--dp-error)' },
 trigger: { display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, textAlign:'left', cursor:'pointer', ':hover':{backgroundColor:'var(--dp-hover)'}, ':active':{backgroundColor:'var(--dp-active)'} },
 selectValue: { minWidth:0, overflowWrap:'anywhere' },
 selectIcon: { display:'inline-flex', flexShrink:0 },
 placeholder: { color:'var(--dp-muted)' },
 indicator: { marginLeft:'auto', width:16, minWidth:16, display:'inline-flex', color:'var(--dp-orange-text)' },
 indicatorHidden: { visibility:'hidden' },
 empty: { padding:'12px', color:'var(--dp-muted)', fontSize:14, lineHeight:1.5 },
 positioner:{ zIndex:80 },
 popup: { width:'var(--anchor-width)', maxWidth:'var(--available-width)', maxHeight:'min(320px, var(--available-height))', overflowY:'auto', backgroundColor:'var(--dp-raised)', color:'var(--dp-text)', padding:6, borderWidth:1, borderStyle:'solid', borderColor:'var(--dp-divider)', borderRadius:'var(--dp-radius-popup)', boxShadow:'var(--dp-shadow-popup)' },
 option: { minHeight:44, padding:'10px 12px', display:'flex', alignItems:'center', gap:10, fontSize:14, lineHeight:1.5, borderRadius:'var(--dp-radius-small)', cursor:'default', outline:'none', overflowWrap:'anywhere', ':focus-visible':{outline:'2px solid var(--dp-focus)',outlineOffset:3} },
 highlighted: { backgroundColor:'var(--dp-hover)' },
 selected: { backgroundColor:'var(--dp-selected)', fontWeight:600 },
 backdrop: { position:'fixed', inset:0, backgroundColor:'#00000085', zIndex:70 },
 dialog: { position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)', width:'min(480px, calc(100vw - 32px))', maxHeight:'calc(100dvh - 40px)', overflowY:'auto', padding:28, backgroundColor:'var(--dp-raised)', color:'var(--dp-text)', borderWidth:1, borderStyle:'solid', borderColor:'var(--dp-divider)', borderRadius:'var(--dp-radius-dialog)', zIndex:71, boxShadow:'var(--dp-shadow-dialog)' },
 title: { margin:'0 0 10px', fontSize:24, lineHeight:1.3, fontWeight:650, letterSpacing:'-0.03em' },
 description: { margin:'0 0 24px', color:'var(--dp-muted)', fontSize:14, lineHeight:1.7 },
 actions: { display:'flex', flexWrap:'wrap', justifyContent:'flex-end', gap:10, marginTop:28 },
});
type NativeButtonProps = Omit<ComponentProps<'button'>, 'color'>;
export type ButtonProps = NativeButtonProps & { variant?:'primary'|'secondary'|'quiet'; loading?:boolean };
export function Button({variant='primary', loading=false, disabled, children, className='', ...props}:ButtonProps) {
 const generated=stylex.props(s.button,s[variant],disabled&&!loading&&s.buttonDisabled);
 return <BaseButton {...props} {...generated} className={generated.className+' dp-control '+className} disabled={disabled||loading} aria-busy={loading||undefined}>
 {loading && <StatusIcon state="pending" kind="loading" />} {children}
 </BaseButton>;
}
export type TextFieldProps = Omit<ComponentProps<'input'>,'size'> & {label:string; description?:string; error?:string};
export function TextField({label,description,error,id:givenId, ...props}:TextFieldProps) {
 const generatedId=useId(); const id=givenId||generatedId;
 const descriptionId=description ? `${id}-description` : undefined;
 const errorId=error ? `${id}-error` : undefined;
 const generated=stylex.props(s.input,!!error&&s.invalid);
 return <div {...stylex.props(s.field)}><label htmlFor={id} {...stylex.props(s.label)}>{label}</label>
 <Input {...props} id={id} {...generated} className={[generated.className,props.className].filter(Boolean).join(' ')} aria-invalid={error?true:props['aria-invalid']} aria-describedby={[props['aria-describedby'],descriptionId,errorId].filter(Boolean).join(' ')||undefined} aria-errormessage={errorId||props['aria-errormessage']}/>
 {description&&<p id={descriptionId} {...stylex.props(s.help)}>{description}</p>}
 {error&&<p id={errorId} role="alert" {...stylex.props(s.help,s.error)}>{error}</p>}</div>;
}
export type SelectOption={value:string;label:string;disabled?:boolean};
export type SelectProps={label:string; value:string|null; onValueChange:(value:string)=>void; options:SelectOption[]; disabled?:boolean; name?:string; placeholder?:string;description?:string;error?:string};
export function Select({label,value,onValueChange,options,disabled,name,placeholder='Choose an option',description,error}:SelectProps) {
 const id=useId(); const descriptionId=description?`${id}-description`:undefined; const errorId=error?`${id}-error`:undefined;
 return <div {...stylex.props(s.field)}><BaseSelect.Root value={value} onValueChange={v=>{if(v!==null)onValueChange(v);}} items={options} disabled={disabled} name={name}>
 <BaseSelect.Label {...stylex.props(s.label)}>{label}</BaseSelect.Label>
 <BaseSelect.Trigger aria-invalid={error?true:undefined} aria-describedby={[descriptionId,errorId].filter(Boolean).join(' ')||undefined} aria-errormessage={errorId} {...stylex.props(s.input,s.trigger,!!error&&s.invalid,disabled&&s.controlDisabled)}><BaseSelect.Value placeholder={placeholder} className={state=>stylex.props(s.selectValue,state.placeholder&&s.placeholder).className}/><BaseSelect.Icon {...stylex.props(s.selectIcon)}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></BaseSelect.Icon></BaseSelect.Trigger>
 <BaseSelect.Portal><BaseSelect.Positioner sideOffset={6} align="start" alignItemWithTrigger={false} {...stylex.props(s.positioner)}><BaseSelect.Popup {...stylex.props(s.popup)}><BaseSelect.List aria-label={label}>
 {options.map(o=><BaseSelect.Item key={o.value} value={o.value} disabled={o.disabled} className={state=>stylex.props(s.option,state.selected&&s.selected,state.highlighted&&s.highlighted,state.disabled&&s.disabled).className}><BaseSelect.ItemText {...stylex.props(s.selectValue)}>{o.label}</BaseSelect.ItemText><BaseSelect.ItemIndicator keepMounted className={state=>stylex.props(s.indicator,!state.selected&&s.indicatorHidden).className}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6"/></svg></BaseSelect.ItemIndicator></BaseSelect.Item>)}
 {options.length===0&&<div role="status" {...stylex.props(s.empty)}>No options available.</div>}
 </BaseSelect.List></BaseSelect.Popup></BaseSelect.Positioner></BaseSelect.Portal>
 </BaseSelect.Root>{description&&<p id={descriptionId} {...stylex.props(s.help)}>{description}</p>}{error&&<p id={errorId} role="alert" {...stylex.props(s.help,s.error)}>{error}</p>}</div>;
}
export type DialogProps={triggerLabel:string;title:string;description:string;children:ReactNode;confirmLabel?:string;onConfirm?:()=>void;open?:boolean;defaultOpen?:boolean;onOpenChange?:(open:boolean)=>void};
export function Dialog({triggerLabel,title,description,children,confirmLabel='Confirm',onConfirm,open,defaultOpen,onOpenChange}:DialogProps) {
 return <BaseDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={next => onOpenChange?.(next)}>
 <BaseDialog.Trigger render={<Button variant="secondary"/>}>{triggerLabel}</BaseDialog.Trigger>
 <BaseDialog.Portal><BaseDialog.Backdrop {...stylex.props(s.backdrop)}/><BaseDialog.Popup {...stylex.props(s.dialog)}>
 <BaseDialog.Title {...stylex.props(s.title)}>{title}</BaseDialog.Title><BaseDialog.Description {...stylex.props(s.description)}>{description}</BaseDialog.Description>
 {children}<div {...stylex.props(s.actions)}><BaseDialog.Close render={<Button variant="secondary"/>}>Cancel</BaseDialog.Close>
 {onConfirm&&<BaseDialog.Close render={<Button/>} onClick={onConfirm}>{confirmLabel}</BaseDialog.Close>}</div>
 </BaseDialog.Popup></BaseDialog.Portal>
 </BaseDialog.Root>;
}

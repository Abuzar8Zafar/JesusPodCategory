(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[5],{360:function(e,t,a){"use strict";a.r(t);var i=a(0),c=a(18),l=a(367),r=a(66),s=a.n(r),n=a(63),d=a(51),o=a(374),m=a(50),b=a(361),u=a(58),j=a(56),h=a(57),O=a(61),x=a(59),g=a(5);t.default=()=>{var e;const[t,a]=Object(i.useState)(!1),[r,p]=Object(i.useState)([]),[v,y]=Object(i.useState)(!1),[f,N]=Object(i.useState)("password"),[w,S]=Object(i.useState)(!1),[C,W]=Object(i.useState)(!1),[U,F]=Object(i.useState)(!1),[I,E]=Object(i.useState)(""),[L,T]=Object(i.useState)("info"),[q,A]=Object(i.useState)([]),[B,D]=Object(i.useState)(""),[H,_]=Object(i.useState)(""),[k,M]=Object(i.useState)(""),[R,z]=Object(i.useState)(""),[G,J]=Object(i.useState)(!1),P=async()=>{a(!0);try{const e=Object(d.b)(m.b,"Newchannels"),t=(await Object(d.f)(e)).docs.map((e=>({id:e.id,...e.data()})));p(t),a(!1)}catch(e){throw console.error("Error fetching channels with categories:",e),a(!1),e}},V=e=>{const t=e.target.files[0];if(t){const e=new FileReader;e.onloadend=()=>{M(e.result)},e.readAsDataURL(t)}else M(null);t&&(e=>{if(!e)return;J(!0);const t=new Date,a="".concat(t.getTime(),"_").concat(null===e||void 0===e?void 0:e.name),i=Object(x.c)(m.c,"UserImages/".concat(a));Object(x.d)(i,e).then((e=>{Object(x.a)(e.ref).then((e=>{X("Image Added Sucessfully","success"),_(e),J(!1)}))}))})(t)},K={cat:(e=>{const t=q.find((t=>t.name===e));return null===t||void 0===t?void 0:t.id})(null===R||void 0===R||null===(e=R.category)||void 0===e?void 0:e.name),title:null===R||void 0===R?void 0:R.title,url:null===R||void 0===R?void 0:R.url},Q=j.a().shape({cat:j.c().required("Category name is required"),title:j.c().required("Title is required"),url:j.c().required("Feed url is required")}),X=(e,t)=>{E(e),T(t),F(!0)};Object(i.useEffect)((()=>{P(),(async()=>{try{const e=Object(d.b)(m.b,"category"),t=(await Object(d.f)(e)).docs.map((e=>({id:e.id,...e.data()})));return A(t),t}catch(e){throw console.error("Error fetching categories:",e),e}})()}),[]);const Y=[{name:"#",selector:(e,t)=>t,maxWidth:"7rem",minWidth:"2rem"},{name:"Image",selector:e=>Object(g.jsx)(n.a,{classes:"tableImg",imageUrl:null===e||void 0===e?void 0:e.imageUrl,circeltrue:!0}),maxWidth:"7rem",minWidth:"2rem"},{name:"Title",selector:e=>null===e||void 0===e?void 0:e.title,maxWidth:"10rem",minWidth:"4rem"},{name:"Cat Name",selector:e=>{var t;return null===e||void 0===e||null===(t=e.category)||void 0===t?void 0:t.name},maxWidth:"7rem",minWidth:"2rem"},{name:"Feed Url",selector:e=>null===e||void 0===e?void 0:e.url,maxWidth:"30rem",minWidth:"20rem"},{name:"Actions",cell:e=>Object(g.jsxs)(g.Fragment,{children:[Object(g.jsx)("button",{className:"loginBtn2",style:{cursor:"pointer",padding:"2px 10px"},onClick:()=>(e=>{z(e),D(null===e||void 0===e?void 0:e.id),_(null===e||void 0===e?void 0:e.imageUrl),y(!0)})(e),children:"Edit"}),Object(g.jsx)("button",{className:"loginBtn2",style:{cursor:"pointer",padding:"2px 10px",marginLeft:20},onClick:()=>(async e=>{try{const t=Object(d.b)(m.b,"Newchannels");await Object(d.c)(Object(d.d)(t,e)),P()}catch(t){console.error("Error deleting channel:",t)}})(e.id),children:"Delete"})]}),maxWidth:"10rem",minWidth:"10rem"}];return Object(g.jsxs)(g.Fragment,{children:[Object(g.jsx)(h.a,{open:U,message:I,severity:L,onClose:()=>{F(!1)}}),Object(g.jsx)(b.a,{title:"Basic Modal",footer:!1,open:v,centered:!0,onCancel:()=>{y(!1)},children:Object(g.jsx)(u.a,{initialValues:K,enableReinitialize:!0,validationSchema:Q,onSubmit:(e,t)=>{let{setSubmitting:a}=t;(async e=>{W(!0);try{const t=Object(d.d)(m.b,"category",null===e||void 0===e?void 0:e.cat),a=await Object(d.e)(t);if(!a.exists())throw W(!1),new Error("Category not found");const i=a.data();let c;return Object(d.b)(m.b,"Newchannels"),B&&(c=Object(d.d)(m.b,"Newchannels",B),await Object(d.i)(c,{title:null===e||void 0===e?void 0:e.title,imageUrl:H,url:null===e||void 0===e?void 0:e.url,category:i,sub:[],download:[],star:[]}),y(!1),X("Podcast Updated Successfully","success")),c.id}catch(t){throw W(!1),console.error("Error adding or updating channel:",t),t}})(e)},children:e=>{let{values:t,errors:a,touched:i,handleChange:r,handleBlur:s,handleSubmit:n}=e;return Object(g.jsx)(l.a,{className:"formHead",onSubmit:n,children:Object(g.jsxs)("section",{children:[Object(g.jsxs)(l.a.Group,{className:"mb-2 hideFocus2",controlId:"formGroupEmail",children:[Object(g.jsx)(l.a.Label,{className:"lableHead",children:"Add Category"}),Object(g.jsx)(l.a.Select,{"aria-label":"Default select example",className:"radius_12",name:"cat",value:t.cat,onChange:r,children:q.map((e=>Object(g.jsx)("option",{value:e.id,children:e.name},e.id)))}),i.cat&&a.cat&&Object(g.jsx)("div",{className:"errorMsg",children:a.cat}),Object(g.jsx)(l.a.Label,{className:"lableHead mt-3",children:"Add Title"}),Object(g.jsx)(l.a.Control,{className:"radius_12 ",placeholder:"Title",name:"title",value:t.title,onChange:r}),i.title&&a.title&&Object(g.jsx)("div",{className:"errorMsg",children:a.title}),Object(g.jsx)(l.a.Label,{className:"lableHead mt-3",children:"Add Feed Url"}),Object(g.jsx)(l.a.Control,{className:"radius_12 ",placeholder:"Url",name:"url",value:t.url,onChange:r}),i.url&&a.url&&Object(g.jsx)("div",{className:"errorMsg",children:a.url})]}),Object(g.jsxs)("div",{className:"d-flex ",style:{flexDirection:"column"},children:[Object(g.jsx)("h6",{className:"lableHead mt-2 mb-2",children:"Upload Image"}),Object(g.jsxs)("div",{children:[Object(g.jsxs)("label",{style:{cursor:"pointer",position:"relative"},htmlFor:"fileInput",className:"cursor-pointer",children:[G&&Object(g.jsx)(c.a,{style:{width:"18px",height:"18px",marginTop:"3px",borderWidth:"0.15em",position:"absolute",top:"2rem",right:"2.5rem",zIndex:"99999",color:"white"},animation:"border",role:"status",children:Object(g.jsx)("span",{className:"visually-hidden",children:"Loading..."})}),H?Object(g.jsx)(g.Fragment,{children:Object(g.jsx)("img",{src:H,alt:"Preview",style:{width:"100px",height:"100px",objectFit:"cover",borderRadius:"50%",position:"relative"},className:"object-cover"})}):Object(g.jsx)("div",{className:"border radius_50 flex justify-content-center items-center",children:Object(g.jsx)("img",{src:O.a,alt:"Camera Icon",width:80,height:80})})]}),Object(g.jsx)(o.a,{type:"file",id:"fileInput",className:"visually-hidden",onChange:V})]})]}),Object(g.jsx)("div",{className:"d-flex flex-column w-50",children:Object(g.jsx)("button",{disabled:C,className:"loginBtn mt-3 ".concat(C?"disbalebtn":""),children:C?Object(g.jsx)(c.a,{style:{width:"18px",height:"18px",marginTop:"3px",borderWidth:"0.15em"},animation:"border",role:"status",children:Object(g.jsx)("span",{className:"visually-hidden",children:"Loading..."})}):"Submit"})})]})})}})}),t?Object(g.jsx)("div",{className:"text-center",children:Object(g.jsx)(c.a,{style:{width:"18px",height:"18px",marginTop:"3px",borderWidth:"0.15em"},animation:"border",role:"status",children:Object(g.jsx)("span",{className:"visually-hidden",children:"Loading..."})})}):Object(g.jsx)(s.a,{columns:Y,data:r,pagination:!0})]})}}}]);
//# sourceMappingURL=5.4aca32b6.chunk.js.map
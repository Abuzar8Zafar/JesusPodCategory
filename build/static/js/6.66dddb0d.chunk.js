(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[6],{371:function(e,t,a){"use strict";a.r(t);var s=a(0),l=a(379),c=a(18),r=a(55),i=a(54),n=(a(91),a(92),a(2)),d=a(62),o=(a(94),a(87),a(45)),b=a(58),j=a(387),u=a(383),h=(a(14),a(105),a(41)),m=a(57),O=(a(75),a(64),a(5));t.default=()=>{const e=Object(n.o)(),[t,a]=Object(s.useState)("password"),[p,x]=Object(s.useState)(!1),[g,v]=Object(s.useState)(!1),[y,f]=Object(s.useState)(!1),[N,S]=Object(s.useState)(""),[w,C]=Object(s.useState)("info"),[T,q]=Object(s.useState)([]),[F,I]=Object(s.useState)(""),[E,L]=Object(s.useState)(""),[_,A]=Object(s.useState)([]),[H,U]=Object(s.useState)(!1),[D,G]=Object(s.useState)(!1),M=(e,t)=>{S(e),C(t),f(!0)},R=i.a().shape({cat:i.c().required("Category name is required"),title:i.c().required("Title is required"),url:i.c().required("Feed url is required"),type:i.c().required("Type is required")});Object(s.useEffect)((()=>{(async()=>{try{const e=Object(h.b)(o.b,"category"),t=(await Object(h.f)(e)).docs.map((e=>({id:e.id,...e.data()})));return q(t),t}catch(e){throw console.error("Error fetching categories:",e),e}})()}),[]);const $=e=>{const t=e.target.files[0];if(t){const e=new FileReader;e.onloadend=()=>{L(e.result)},e.readAsDataURL(t)}else L(null);t&&(e=>{if(!e)return;G(!0);const t=`${(new Date).getTime()}_${null===e||void 0===e?void 0:e.name}`,a=Object(m.c)(o.c,`UserImages/${t}`);Object(m.d)(a,e).then((e=>{Object(m.a)(e.ref).then((e=>{M("Image Added Sucessfully","success"),I(e),G(!1)}))}))})(t)};return Object(O.jsxs)(O.Fragment,{children:[Object(O.jsx)(d.a,{open:y,message:N,severity:w,onClose:()=>{f(!1)}}),Object(O.jsx)(r.a,{initialValues:{cat:"",title:"",url:"",type:""},validationSchema:R,onSubmit:(t,a)=>{let{setSubmitting:s}=a;(async t=>{v(!0);try{const a=Object(h.d)(o.b,"category",null===t||void 0===t?void 0:t.cat),s=await Object(h.e)(a);if(!s.exists())throw v(!1),new Error("Category not found");const l=s.data(),c=Object(u.a)(),r=Object(h.b)(o.b,"Newchannels"),i=await Object(h.a)(r,{_id:c,title:null===t||void 0===t?void 0:t.title,imageUrl:F,url:null===t||void 0===t?void 0:t.url,category:l,sub:[],type:null===t||void 0===t?void 0:t.type,download:[],star:[]});return e("/listCategory"),M("Podcast Added Sucessfully","success"),v(!1),i.id}catch(a){throw v(!1),console.error("Error adding channel:",a),a}})(t)},children:e=>{let{values:t,errors:a,touched:s,handleChange:r,handleBlur:i,handleSubmit:n}=e;return Object(O.jsx)(l.a,{className:"formHead",style:{width:"40%"},onSubmit:n,children:Object(O.jsxs)("section",{className:"bord",children:[Object(O.jsxs)(l.a.Group,{className:"mb-2 hideFocus2",controlId:"formGroupEmail",children:[Object(O.jsx)(l.a.Label,{className:"lableHead",children:"Add Category"}),Object(O.jsx)(l.a.Select,{"aria-label":"Default select example",className:"radius_12",name:"cat",value:t.cat,onChange:r,children:T.map((e=>Object(O.jsx)("option",{value:e.id,children:e.name},e.id)))}),s.cat&&a.cat&&Object(O.jsx)("div",{className:"errorMsg",children:a.cat}),Object(O.jsx)(l.a.Label,{className:"lableHead mt-3",children:"Add Title"}),Object(O.jsx)(l.a.Control,{className:"radius_12 ",placeholder:"Title",name:"title",value:t.title,onChange:r}),s.title&&a.title&&Object(O.jsx)("div",{className:"errorMsg",children:a.title}),Object(O.jsx)(l.a.Label,{className:"lableHead mt-3",children:"Add Feed Url"}),Object(O.jsx)(l.a.Control,{className:"radius_12 ",placeholder:"Url",name:"url",value:t.url,onChange:r}),s.url&&a.url&&Object(O.jsx)("div",{className:"errorMsg",children:a.url})]}),Object(O.jsx)(l.a.Label,{className:"lableHead mt-3",children:"Select Type"}),Object(O.jsxs)(l.a.Select,{"aria-label":"Default select example",className:"radius_12",name:"type",value:t.type,onChange:r,children:[Object(O.jsx)("option",{value:"",disabled:!0,children:"Select Type"}),Object(O.jsx)("option",{value:"Global",children:"Global"}),Object(O.jsx)("option",{value:"Espanol",children:"Espanol"}),Object(O.jsx)("option",{value:"Nigerians",children:"Nigerians"})]}),s.type&&a.type&&Object(O.jsx)("div",{className:"errorMsg",children:a.type}),Object(O.jsxs)("div",{className:"d-flex ",style:{flexDirection:"column"},children:[Object(O.jsx)("h6",{className:"lableHead mt-2 mb-2",children:"Upload Image"}),Object(O.jsxs)("div",{children:[Object(O.jsxs)("label",{style:{cursor:"pointer",position:"relative"},htmlFor:"fileInput",className:"cursor-pointer",children:[D&&Object(O.jsx)(c.a,{style:{width:"18px",height:"18px",marginTop:"3px",borderWidth:"0.15em",position:"absolute",top:"1.5rem",right:"2rem",zIndex:"99999",color:"red"},animation:"border",role:"status",children:Object(O.jsx)("span",{className:"visually-hidden",children:"Loading..."})}),F?Object(O.jsx)(O.Fragment,{children:Object(O.jsx)("img",{src:F,alt:"Preview",style:{width:"100px",height:"100px",objectFit:"cover",borderRadius:"50%",position:"relative"},className:"object-cover"})}):Object(O.jsx)("div",{className:"border radius_50 flex justify-content-center items-center",children:Object(O.jsx)("img",{src:b.a,alt:"Camera Icon",width:80,height:80})})]}),Object(O.jsx)(j.a,{type:"file",id:"fileInput",className:"visually-hidden",onChange:$})]})]}),Object(O.jsx)("div",{className:"d-flex flex-column w-50",children:Object(O.jsx)("button",{disabled:g,className:"loginBtn mt-3 "+(g?"disbalebtn":""),children:g?Object(O.jsx)(c.a,{style:{width:"18px",height:"18px",marginTop:"3px",borderWidth:"0.15em"},animation:"border",role:"status",children:Object(O.jsx)("span",{className:"visually-hidden",children:"Loading..."})}):"Submit"})})]})})}})]})}}}]);
//# sourceMappingURL=6.66dddb0d.chunk.js.map
const fs=require('fs');const d=require('docx');
const {Document,Packer,Paragraph,TextRun,HeadingLevel}=d;
const lines=fs.readFileSync(process.argv[2],'utf8').split('\n').filter(l=>l.trim());
const F="Calibri";const kids=[];
for(const l of lines){
  if(l.startsWith('# ')) kids.push(new Paragraph({heading:HeadingLevel.TITLE,children:[new TextRun({text:l.slice(2)})]}));
  else if(l.startsWith('## ')) kids.push(new Paragraph({heading:HeadingLevel.HEADING_1,children:[new TextRun({text:l.slice(3)})]}));
  else if(l.startsWith('~ ')) kids.push(new Paragraph({spacing:{after:200},children:[new TextRun({text:l.slice(2),italics:true,color:"555555",font:F,size:22})]}));
  else if(l.startsWith('[')) kids.push(new Paragraph({spacing:{before:160,after:80},keepNext:true,children:[new TextRun({text:l,bold:true,color:"1F4E79",font:F,size:22})]}));
  else kids.push(new Paragraph({spacing:{after:140,line:300},children:[new TextRun({text:l,font:F,size:24})]}));
}
const doc=new Document({styles:{default:{document:{run:{font:F,size:24}},
 title:{run:{font:F,size:40,bold:true},paragraph:{spacing:{before:0,after:160},keepNext:true}},
 heading1:{run:{font:F,size:30,bold:true,color:"14181F"},paragraph:{spacing:{before:360,after:120},keepNext:true}}}},
 sections:[{properties:{page:{size:{width:12240,height:15840},margin:{top:1440,bottom:1440,left:1440,right:1440}}},children:kids}]});
Packer.toBuffer(doc).then(b=>fs.writeFileSync(process.argv[3],b));

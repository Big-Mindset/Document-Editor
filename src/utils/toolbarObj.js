import React from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Heading,
  Type,
  Quote,
  List,
  ListOrdered,
  CheckSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image,
  Table,
  Code,
  Undo,
  Redo,
  Eraser,
  MoreHorizontal,
  Eye
} from "lucide-react";

const Divider = <span style={{ display: "inline-block", width: 1, height: 20, background: "red", opacity: 0.25 }} />;

export const lexicalToolbarItems = [
  { id: "undo", icon: <Undo size={18} />, type: "history" },
  { id: "redo", icon: <Redo size={18} />, type: "history" },
  { id: "preview", icon: <Eye size={18} />, type: "utility" },
  
  
  { id: "divider-1", icon: Divider, type: "divider" },
  
  { id: "strikethrough", icon: <Strikethrough size={18} />, type: "text-format" },
  { id: "clear-format", icon: <Eraser size={18} />, type: "text-format" },
  
  { id: "divider-6", icon: Divider, type: "divider" },
  
  { id: "heading", icon: <Heading size={18} />, type: "block-format" },
  { id: "fonts", icon: <Type size={18} />, type: "block-format" },
  { id: "font-size", icon: <Quote size={18} />, type: "block-format" },
  
  { id: "divider-2", icon: Divider, type: "divider" },
  
  { id: "bold", icon: <Bold size={18} />, type: "text-format" },
  { id: "italic", icon: <Italic size={18} />, type: "text-format" },
  { id: "underline", icon: <Underline size={18} />, type: "text-format" },
  { id: "highlight", icon: <Highlighter size={18} />, type: "text-format" },
  { id: "text-color", icon: <Type  size={18} />, type: "text-format" },

  { id: "divider-3", icon: Divider, type: "divider" },

  { id: "unordered-list", icon: <List size={18} />, type: "list" },
  { id: "ordered-list", icon: <ListOrdered size={18} />, type: "list" },
  { id: "check", icon: <CheckSquare size={18} />, type: "list" },

  { id: "divider-4", icon: Divider, type: "divider" },

  { id: "left", icon: <AlignLeft size={18} />, type: "alignment" },
  { id: "center", icon: <AlignCenter size={18} />, type: "alignment" },
  { id: "right", icon: <AlignRight size={18} />, type: "alignment" },
  { id: "justify", icon: <AlignJustify size={18} />, type: "alignment" },

  { id: "divider-5", icon: Divider, type: "divider" },

  { id: "table", icon: <Table size={18} />, type: "insert" },
  
];

export const lexicalFontOptions = [
  { id: "inter", label: "Inter", fontFamily: "'Inter', sans-serif" },
  { id: "roboto", label: "Roboto", fontFamily: "'Roboto', sans-serif" },
  { id: "poppins", label: "Poppins", fontFamily: "'Poppins', sans-serif" },
  { id: "open-sans", label: "Open Sans", fontFamily: "'Open Sans', sans-serif" },
  { id: "lato", label: "Lato", fontFamily: "'Lato', sans-serif" },
  { id: "montserrat", label: "Montserrat", fontFamily: "'Montserrat', sans-serif" },
  { id: "merriweather", label: "Merriweather", fontFamily: "'Merriweather', serif" },
  { id: "playfair-display", label: "Playfair Display", fontFamily: "'Playfair Display', serif" },
  { id: "source-serif", label: "Source Serif Pro", fontFamily: "'Source Serif Pro', serif" },
  { id: "fira-code", label: "Fira Code", fontFamily: "'Fira Code', monospace" },
  { id: "jetbrains-mono", label: "JetBrains Mono", fontFamily: "'JetBrains Mono', monospace" },
  { id: "space-mono", label: "Space Mono", fontFamily: "'Space Mono', monospace" },
  { id: "oswald", label: "Oswald", fontFamily: "'Oswald', sans-serif" },
  { id: "bebas-neue", label: "Bebas Neue", fontFamily: "'Bebas Neue', sans-serif" },
  { id: "raleway", label: "Raleway", fontFamily: "'Raleway', sans-serif" },
  { id: "nunito", label: "Nunito", fontFamily: "'Nunito', sans-serif" },
  { id: "dm-sans", label: "DM Sans", fontFamily: "'DM Sans', sans-serif" },
  { id: "ubuntu", label: "Ubuntu", fontFamily: "'Ubuntu', sans-serif" },
  { id: "work-sans", label: "Work Sans", fontFamily: "'Work Sans', sans-serif" },
  { id: "noticia-text", label: "Noticia Text", fontFamily: "'Noticia Text', serif" },
];

export const textSizes = [
  {
    name: "Heading 1",
    id : "h1",
    textSize: "text-[2.25rem]",
    fontWeight: "font-bold",
  },
  {
    name: "Heading 2",
    id : "h2",
    textSize: "text-[1.875rem]",
    fontWeight: "font-semibold",
  },
  {
    name: "Heading 3",
    id : "h3",
    textSize: "text-[1.5rem]",
    fontWeight: "font-semibold",
  },
  {
    name: "Title",
    id : "title",
    textSize: "text-[24pt]",
    fontWeight: "font-medium",
  },
  {
    name: "Subtitle",
    id : "sub_title",
    
    textSize: "text-lg",
    fontWeight: "font-normal text-gray-600",
  },
  {
    name: "Normal text",
    id : "paragraph",
    textSize: "text-base",
    fontWeight: "font-normal",
  },
  {
    name: "Caption",
    textSize: "text-[0.875rem]",
    fontWeight: "font-normal text-gray-500",
  },
];



export const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 60, 72];

export const highlightColors = [
  "#FFFFFF",
  "#F5F5F5",
  "#E0E0E0",
  "#000000",
  "#FFCDD2",
  "#F48FB1",
  "#FF8A80",
  "#EF5350",
  "#C62828",
  "#FFE0B2",
  "#FFAB91",
  "#FF9800",
  "#F57C00",
  "#FFF9C4",
  "#FFF176",
  "#FFD54F",
  "#FBC02D",
  "#DCEDC8",
  "#C5E1A5",
  "#AED581",
  "#66BB6A",
  "#2E7D32",
  "#B2DFDB",
  "#4DB6AC",
  "#E1F5FE",
  "#81D4FA",
  "#4FC3F7",
  "#42A5F5",
  "#1976D2",
  "#C5CAE9",
  "#7986CB",
  "#E1BEE7",
  "#CE93D8",
  "#AB47BC",
  "#D1C4E9",
  "#9575CD",
  "#D7CCC8",
  "#BCAAA4",
  "#8D6E63",
  "#5D4037"
];

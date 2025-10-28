import {
  autoUpdate,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/react-dom';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OPEN_FLOATING_COMPOSER_COMMAND } from '@liveblocks/react-lexical';
import { $getSelection, $isRangeSelection, $isTextNode } from 'lexical';
import { MessageSquare } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function FloatingToolbar() {
  const [editor] = useLexicalComposerContext();
  const [range, setRange] = useState(null);

  useEffect(() => {
    const unregister = editor.registerUpdateListener(({ tags }) => {
      return editor.getEditorState().read(() => {
        // Ignore selection updates related to collaboration
        if (tags.has('collaboration')) return;

        const selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.isCollapsed()) {
          setRange(null);
          return;
        }

        const { anchor, focus } = selection;

        const newRange = createDOMRange(
          editor,
          anchor.getNode(),
          anchor.offset,
          focus.getNode(),
          focus.offset
        );

        setRange(newRange);
      });
    });

    return () => unregister();
  }, [editor]);

  if (range === null) return null;

  return <Toolbar range={range} onRangeChange={setRange} container={document.body} />;
}

function Toolbar({ range, onRangeChange, container }) {
  const [editor] = useLexicalComposerContext();

  const padding = 20;

  const {
    refs: { setReference, setFloating },
    strategy,
    x,
    y,
  } = useFloating({
    strategy: 'fixed',
    placement: 'bottom',
    middleware: [
      flip({ padding, crossAxis: false }),
      offset(10),
      hide({ padding }),
      shift({ padding, limiter: limitShift() }),
      size({ padding }),
    ],
    whileElementsMounted: (...args) =>
      autoUpdate(...args, { animationFrame: true }),
  });

  useLayoutEffect(() => {
    setReference({
      getBoundingClientRect: () => range.getBoundingClientRect(),
    });
  }, [setReference, range]);

  return createPortal(
    <div
      ref={setFloating}
      style={{
        position: strategy,
        top: 0,
        left: 0,
        transform: `translate3d(${Math.round(x || 0)}px, ${Math.round(y || 0)}px, 0)`,
        minWidth: 'max-content',
      }}
    >
      <div className="floating-toolbar">
        <button
          onClick={() => {
            const isOpen = editor.dispatchCommand(OPEN_FLOATING_COMPOSER_COMMAND, undefined);
            if (isOpen) {
              onRangeChange(null);
            }
          }}
          className="p-2 rounded-md cursor-pointer bg-blue-500/30"
        >
          <MessageSquare size={20} />
        </button>
      </div>
    </div>,
    container
  );
}

// ---------------------------
// Helper Functions
// ---------------------------

function getDOMTextNode(element) {
  let node = element;

  while (node !== null) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node;
    }
    node = node.firstChild;
  }

  return null;
}

function getDOMIndexWithinParent(node) {
  const parent = node.parentNode;

  if (parent === null) {
    throw new Error('Should never happen');
  }

  return [parent, Array.from(parent.childNodes).indexOf(node)];
}

export function createDOMRange(editor, anchorNode, _anchorOffset, focusNode, _focusOffset) {
  const anchorKey = anchorNode.getKey();
  const focusKey = focusNode.getKey();
  const range = document.createRange();
  let anchorDOM = editor.getElementByKey(anchorKey);
  let focusDOM = editor.getElementByKey(focusKey);
  let anchorOffset = _anchorOffset;
  let focusOffset = _focusOffset;

  if ($isTextNode(anchorNode)) {
    anchorDOM = getDOMTextNode(anchorDOM);
  }

  if ($isTextNode(focusNode)) {
    focusDOM = getDOMTextNode(focusDOM);
  }

  if (!anchorNode || !focusNode || !anchorDOM || !focusDOM) {
    return null;
  }

  if (anchorDOM.nodeName === 'BR') {
    [anchorDOM, anchorOffset] = getDOMIndexWithinParent(anchorDOM);
  }

  if (focusDOM.nodeName === 'BR') {
    [focusDOM, focusOffset] = getDOMIndexWithinParent(focusDOM);
  }

  const firstChild = anchorDOM.firstChild;

  if (
    anchorDOM === focusDOM &&
    firstChild !== null &&
    firstChild.nodeName === 'BR' &&
    anchorOffset === 0 &&
    focusOffset === 0
  ) {
    focusOffset = 1;
  }

  try {
    range.setStart(anchorDOM, anchorOffset);
    range.setEnd(focusDOM, focusOffset);
  } catch (e) {
    return null;
  }

  if (range.collapsed && (anchorOffset !== focusOffset || anchorKey !== focusKey)) {
    // Range is backwards, we need to reverse it
    range.setStart(focusDOM, focusOffset);
    range.setEnd(anchorDOM, anchorOffset);
  }

  return range;
}

'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  SmilePlus,
  Strikethrough,
  Undo2,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeightClassName?: string;
  placeholder?: string;
}

function ToolbarButton({
  label,
  isActive,
  disabled,
  onClick,
  children,
}: {
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={isActive}
      disabled={disabled}
      onClick={onClick}
      className={`grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg border text-gray-600 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 ${
        isActive
          ? 'border-black bg-black text-white'
          : 'border-gray-200 bg-white hover:border-black hover:text-black'
      }`}
    >
      {children}
    </button>
  );
}

const EMOJI_OPTIONS = ['😊', '🔥', '✨', '👏', '💡', '📌', '🇰🇷', '🎧', '🎬', '⚽', '🍜', '❤️'];

export function RichTextEditor({
  value,
  onChange,
  minHeightClassName = 'min-h-[280px]',
  placeholder,
}: RichTextEditorProps) {
  const [isEmojiPanelOpen, setIsEmojiPanelOpen] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: `rich-text-editor-content ${minHeightClassName}`,
        'aria-label': placeholder ?? '본문 편집기',
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      onChange(editor.getHTML());
    };

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
    };
  }, [editor, onChange]);

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() === value) return;

    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  if (!editor) {
    return (
      <div
        className={`${minHeightClassName} animate-pulse rounded-xl border border-gray-200 bg-gray-50`}
      />
    );
  }

  const runInlineFormat = (toggle: () => void, unset: () => void) => {
    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;

    toggle();

    if (!hasSelection) return;

    editor.commands.setTextSelection(to);
    unset();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-black">
      <div className="flex gap-1.5 overflow-x-auto border-b border-gray-100 bg-gray-50 p-2">
        <ToolbarButton
          label="굵게"
          isActive={editor.isActive('bold')}
          onClick={() =>
            runInlineFormat(
              () => editor.chain().focus().toggleBold().run(),
              () => editor.chain().focus().unsetBold().run(),
            )
          }
        >
          <Bold size={17} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          label="기울임"
          isActive={editor.isActive('italic')}
          onClick={() =>
            runInlineFormat(
              () => editor.chain().focus().toggleItalic().run(),
              () => editor.chain().focus().unsetItalic().run(),
            )
          }
        >
          <Italic size={17} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          label="취소선"
          isActive={editor.isActive('strike')}
          onClick={() =>
            runInlineFormat(
              () => editor.chain().focus().toggleStrike().run(),
              () => editor.chain().focus().unsetStrike().run(),
            )
          }
        >
          <Strikethrough size={17} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          label="제목 1"
          isActive={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 size={18} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          label="제목 2"
          isActive={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 size={18} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          label="제목 3"
          isActive={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 size={18} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          label="인용"
          isActive={editor.isActive('blockquote')}
          onClick={() => {
            const chain = editor.chain().focus();
            if (editor.isActive('blockquote')) {
              chain.lift('blockquote').run();
              return;
            }
            chain.wrapIn('blockquote').run();
          }}
        >
          <Quote size={17} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          label="글머리 목록"
          isActive={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={18} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          label="번호 목록"
          isActive={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={18} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          label="구분선"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={18} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          label="이모지"
          isActive={isEmojiPanelOpen}
          onClick={() => setIsEmojiPanelOpen((current) => !current)}
        >
          <SmilePlus size={17} strokeWidth={2.5} />
        </ToolbarButton>
        <div className="mx-1 h-9 w-px flex-shrink-0 bg-gray-200" />
        <ToolbarButton
          label="실행 취소"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 size={17} strokeWidth={2.5} />
        </ToolbarButton>
        <ToolbarButton
          label="다시 실행"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 size={17} strokeWidth={2.5} />
        </ToolbarButton>
      </div>

      {isEmojiPanelOpen && (
        <div className="grid grid-cols-6 gap-1 border-b border-gray-100 bg-white p-2 sm:flex sm:flex-wrap">
          {EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="grid h-9 w-9 place-items-center rounded-lg text-lg transition-colors cursor-pointer hover:bg-gray-100"
              onClick={() => editor.chain().focus().insertContent(emoji).run()}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}

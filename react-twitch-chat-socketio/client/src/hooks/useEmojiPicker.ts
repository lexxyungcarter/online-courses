import React, { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { EmojiClickData } from 'emoji-picker-react'

export default function useEmojiPicker(
  handleEmojiPick: (emoji: string) => void
) {
  const [ isOpen, setIsOpen ] = useState(false);
  const pickerRef = useRef(null);

  const handleEmojiClick = ({ emoji }: EmojiClickData, _: MouseEvent): void => {
    handleEmojiPick(emoji);
  };

  const toggleEmojiPick: React.MouseEventHandler = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  useOnClickOutside(pickerRef, () => {
    setIsOpen(false);
  });

  return {
    pickerRef,
    isOpen,
    toggleEmojiPick,
    handleEmojiClick
  };
}
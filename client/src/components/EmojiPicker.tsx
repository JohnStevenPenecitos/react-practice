import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string | { value: string; native: string }) => void; // Update the type definition
}

function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <div>
      <Picker
        data={data}
        emojiSize={20}
        emojiButtonSize={28}
        onEmojiSelect={onEmojiSelect}
        maxFrequentRows={4}
      />
    </div>
  );
}

export default EmojiPicker;

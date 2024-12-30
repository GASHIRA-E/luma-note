import { Input, HStack, Button } from "@chakra-ui/react";

import {
  PopoverBody,
  PopoverContent,
  PopoverRoot,
  PopoverArrow,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tag } from "@/components/ui/tag";
import { HiCheck } from "react-icons/hi";

type SearchInputProps = {
  /** ポップオーバーの表示状態を制御するステート */
  isOpen: boolean;
  /** 入力フォーカスイベントを処理する関数 */
  onFocusTriggerInput: React.FocusEventHandler<HTMLInputElement>;
  /** ポップオーバーを閉じる関数 */
  onClose: () => void;
  /** 入力フィールドの現在の値 */
  inputValue: string;
  /** 入力値を更新する関数 */
  setInputValue: (value: string) => void;
  /** 利用可能なすべてのタグのリスト */
  allTags: { id: number; name: string }[];
  /** 選択されたタグIDのリスト */
  selectedTagIds: number[];
  /** タグクリックイベントを処理する関数 */
  onClickTag: (id: number) => void;
  /** フィルターボタンクリックイベントを処理する関数 */
  onClickFilterButton: () => void;
  /** 選択をクリアする関数 */
  onClickClear: React.MouseEventHandler<HTMLButtonElement>;
};

export const SearchInput = ({
  allTags,
  isOpen,
  onClose,
  inputValue,
  setInputValue,
  onClickClear,
  selectedTagIds,
  onClickTag,
  onFocusTriggerInput,
  onClickFilterButton,
}: SearchInputProps) => {
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      onClickFilterButton();
    }
  };

  return (
    <PopoverRoot
      open={isOpen}
      autoFocus={false}
      onFocusOutside={onClose}
      onPointerDownOutside={onClose}
    >
      <PopoverTrigger>
        <Input
          placeholder="メモタイトル"
          w={300}
          value={inputValue}
          onFocus={onFocusTriggerInput}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <HStack flexWrap="wrap" mb={4}>
            {allTags.map((tag) => (
              <Tag
                key={tag.id}
                cursor="pointer"
                variant={selectedTagIds.includes(tag.id) ? "solid" : "surface"}
                endElement={
                  selectedTagIds.includes(tag.id) ? <HiCheck /> : undefined
                }
                onClick={() => onClickTag(tag.id)}
              >
                {tag.name}
              </Tag>
            ))}
          </HStack>
          <HStack>
            <Button onClick={onClickFilterButton}>絞り込む</Button>
            <Button onClick={onClickClear}>絞り込みクリア</Button>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

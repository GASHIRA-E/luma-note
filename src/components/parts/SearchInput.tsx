import { useState } from "react";
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

export const SearchInput = () => {
  // 開閉状態を管理するためのstate
  const [isOpen, setIsOpen] = useState(false);
  const handleFocusInput = () => setIsOpen(true);

  const tags = [...Array(20)].map((_, i) => ({ id: i, name: `Tag${i}` }));
  // タグの選択状態を管理するためのstate
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const handleClickTag = (id: number) => {
    if (selectedTagIds.includes(id)) {
      setSelectedTagIds(selectedTagIds.filter((v) => v !== id));
    } else {
      setSelectedTagIds([...selectedTagIds, id]);
    }
  };

  return (
    <PopoverRoot open={isOpen}>
      <PopoverTrigger>
        <Input placeholder="search text" w={300} onFocus={handleFocusInput} />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <HStack flexWrap="wrap" mb={4}>
            {tags.map((tag) => (
              <Tag
                key={tag.id}
                variant={selectedTagIds.includes(tag.id) ? "solid" : "surface"}
                endElement={
                  selectedTagIds.includes(tag.id) ? <HiCheck /> : undefined
                }
                onClick={() => handleClickTag(tag.id)}
              >
                {tag.name}
              </Tag>
            ))}
          </HStack>
          <Button onClick={() => setIsOpen(false)}>絞り込む</Button>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

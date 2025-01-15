import { Box } from "@chakra-ui/react";
import { HiOutlineCubeTransparent } from "react-icons/hi";

import { EmptyState } from "@/components/ui/empty-state";

export const NotSelectedMemo = () => {
  return (
    <Box flexGrow={1}>
      <EmptyState
        icon={<HiOutlineCubeTransparent />}
        title="メモが選択されていません"
      />
    </Box>
  );
};

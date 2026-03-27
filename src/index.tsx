import { ActionPanel, List, Action, showToast, Toast, Icon, popToRoot, useNavigation } from "@raycast/api";
import { exec } from "child_process";
import { readdirSync } from "fs";
import { homedir } from "os";
import { useState, useEffect } from "react";

const BASE_FOLDER = `${homedir()}/Sites`;

interface Folder {
  name: string;
  path: string;
}

function getSubfolders(parentPath: string): Folder[] {
  return readdirSync(parentPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => !dirent.name.startsWith("."))
    .map((dirent) => ({
      name: dirent.name,
      path: `${parentPath}/${dirent.name}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function openInCursor(folderPath: string) {
  exec(`cursor "${folderPath}"`, async (error) => {
    if (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to open folder",
        message: error.message,
      });
      return;
    }
  });
  popToRoot();
}

function FolderList({ parentPath, title, isRoot = true }: { parentPath: string; title?: string; isRoot?: boolean }) {
  const { push, pop } = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      setFolders(getSubfolders(parentPath));
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to read folders",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [parentPath]);

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search folders..."
      onSearchTextChange={setSearchText}
      navigationTitle={title}
      throttle
    >
      {filteredFolders.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icon.Folder}
          title="No folders found"
          description={searchText ? `No matches for "${searchText}"` : `No subfolders in ${parentPath}`}
        />
      ) : (
        filteredFolders.map((folder) => (
          <List.Item
            key={folder.name}
            title={folder.name}
            icon={Icon.Folder}
            actions={
              <ActionPanel>
                <Action title="Open in Cursor" onAction={() => openInCursor(folder.path)} icon={Icon.Code} />
                <Action
                  title="Browse Subfolders"
                  icon={Icon.ArrowRight}
                  shortcut={{ modifiers: [], key: "arrowRight" }}
                  onAction={() => push(<FolderList parentPath={folder.path} title={folder.name} isRoot={false} />)}
                />
                <Action.ShowInFinder path={folder.path} />
                <Action.CopyToClipboard title="Copy Path" content={folder.path} />
                {!isRoot && (
                  <Action
                    title="Go Back"
                    icon={Icon.ArrowLeft}
                    shortcut={{ modifiers: [], key: "arrowLeft" }}
                    onAction={() => pop()}
                  />
                )}
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}

export default function Command() {
  return <FolderList parentPath={BASE_FOLDER} />;
}

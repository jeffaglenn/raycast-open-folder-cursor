import { ActionPanel, List, Action, showToast, Toast, Icon, popToRoot } from "@raycast/api";
import { exec } from "child_process";
import { readdirSync } from "fs";
import { homedir } from "os";
import { useState, useEffect } from "react";

const BASE_FOLDER = `${homedir()}/Sites`;

interface Folder {
  name: string;
  path: string;
}

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const allFolders = readdirSync(BASE_FOLDER, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .filter((dirent) => !dirent.name.startsWith("."))
        .map((dirent) => ({
          name: dirent.name,
          path: `${BASE_FOLDER}/${dirent.name}`,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      setFolders(allFolders);
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Failed to read folders",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchText.toLowerCase())
  );

  function openInCursor(folder: Folder) {
    exec(`cursor "${folder.path}"`, async (error) => {
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

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search folders..."
      onSearchTextChange={setSearchText}
      throttle
    >
      {filteredFolders.length === 0 && !isLoading ? (
        <List.EmptyView
          icon={Icon.Folder}
          title="No folders found"
          description={searchText ? `No matches for "${searchText}"` : "No folders in ~/Sites"}
        />
      ) : (
        filteredFolders.map((folder) => (
          <List.Item
            key={folder.name}
            title={folder.name}
            icon={Icon.Folder}
            actions={
              <ActionPanel>
                <Action title="Open in Cursor" onAction={() => openInCursor(folder)} icon={Icon.Code} />
                <Action.ShowInFinder path={folder.path} />
                <Action.CopyToClipboard title="Copy Path" content={folder.path} />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}

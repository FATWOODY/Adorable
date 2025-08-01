"use client";

import { requestDevServer as requestDevServerInner } from "./webview-actions";
import "./loader.css";
import {
  FreestyleDevServer,
  FreestyleDevServerHandle,
} from "freestyle-sandboxes/react/dev-server";
import { useRef } from "react";
import { Button } from "./ui/button";
import { RefreshCwIcon } from "lucide-react";
import { ShareButton } from "./share-button";

export default function WebView(props: {
  repo: string;
  baseId: string;
  appId: string;
  domain?: string;
}) {
  function requestDevServer({ repoId }: { repoId: string }) {
    return requestDevServerInner({ repoId });
  }

  const devServerRef = useRef<FreestyleDevServerHandle>(null);

  console.log("WebView props:", props);

  return (
    <div className="flex flex-col overflow-hidden h-screen border-l transition-opacity duration-700 mt-[2px]">
      <div className="h-12 border-b border-gray-200 items-center flex px-2 bg-background sticky top-0 justify-end gap-2">
        <Button
          variant={"ghost"}
          size={"icon"}
          onClick={() => devServerRef.current?.refresh()}
        >
          <RefreshCwIcon />
        </Button>
        <ShareButton domain={props.domain} appId={props.appId} />
      </div>
      <FreestyleDevServer
        ref={devServerRef}
        actions={{ requestDevServer }}
        repoId={props.repo}
        key={props.repo}
        loadingComponent={({ iframeLoading, devCommandRunning }) =>
          (iframeLoading || !devCommandRunning) && (
            <div className="flex items-center justify-center h-full">
              <div>
                <div className="text-center">
                  {iframeLoading ? "Loading Preview..." : devCommandRunning ? "Starting Development Server..." : "Initializing..."}
                </div>
                <div>
                  <div className="loader"></div>
                </div>
              </div>
            </div>
          )
        }
        errorComponent={({ error }) => (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-red-600 mb-2">Preview Error</div>
              <div className="text-sm text-gray-600">
                {error?.message || "Failed to load preview"}
              </div>
              <button 
                onClick={() => devServerRef.current?.refresh()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
}

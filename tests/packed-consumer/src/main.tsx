import '@leverui/components/styles.css';
import './theme.css';
import {
  Box,
  Button,
  CloseButton,
  IconButton,
  Loader,
  LoaderOverlay,
  Spinner,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
  Theme,
} from '@leverui/components';
import { type Component } from 'solid-js';
import { render } from '@solidjs/web';
import { PackedSections } from './packed-sections';
import { PackedTabsFamily } from './packed-tabs-family';
import { PackedStepsFamily } from './packed-steps-family';
import { PackedTreeViewFamily } from './packed-tree-view-family';

const sections = import.meta.glob<{ default: Component }>('./core-section-*.tsx', { eager: true });

const root = document.getElementById('app');
if (!root) throw new Error('The packed consumer app has no root element.');

render(
  /** Render the packaged controls in a separate Solid application. */
  () => (
    <>
      <Box id="packed-box" class="packed-box-surface">
        Packed Box
      </Box>
      <Box id="packed-escaped-box" class="packed-box-raw-spacing">
        Raw spacing
      </Box>
      <Theme class="brand-scope">
        <Button id="packed-button" colorPalette="blue">
          Packed Button
        </Button>
        <IconButton
          as="a"
          href="#packed-icon-link"
          aria-label="Packed icon link"
          id="packed-icon-link"
        >
          ↗
        </IconButton>
        <CloseButton as="span" role="button" id="packed-close-span" />
        <Spinner id="packed-spinner" size="sm" role="status" aria-label="Packed loading" />
        <Box id="packed-loader-host" class="packed-box-loader-host">
          <Loader id="packed-loader" text="Working">
            Ready
          </Loader>
          <LoaderOverlay id="packed-loader-overlay">Overlay</LoaderOverlay>
        </Box>
        <TabsRoot defaultValue="one" size="sm">
          <TabsList aria-label="Packed tabs">
            <TabsTrigger value="one" data-testid="packed-tab-one">
              One
            </TabsTrigger>
            <TabsTrigger value="two" data-testid="packed-tab-two">
              Two
            </TabsTrigger>
          </TabsList>
          <TabsContent value="one" data-testid="packed-panel-one">
            First packed panel
          </TabsContent>
          <TabsContent value="two" data-testid="packed-panel-two">
            Second packed panel
          </TabsContent>
        </TabsRoot>
        <PackedTabsFamily />
        <PackedStepsFamily />
        <PackedTreeViewFamily />
        <PackedSections modules={sections} />
      </Theme>
    </>
  ),
  root,
);

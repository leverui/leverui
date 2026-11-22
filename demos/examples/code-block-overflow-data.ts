/** Preserve the long horizontal-scrolling source lines. */
export const overflowFile = {
  code: `// Example with very long lines that require horizontal scrolling
import { Button, Stack, Container, Text, Heading, Box, Flex, Grid, GridItem, VStack, HStack, Center, Circle, Square, Spacer, Wrap, WrapItem } from "@leverui/components"

const veryLongConfigurationObject = { primaryColor: "#3182ce", secondaryColor: "#805ad5", tertiaryColor: "#38b2ac", backgroundColor: "#ffffff", textColor: "#1a202c", fontSize: "16px", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif" }

function ExampleComponent() {
  const extremelyLongVariableName = "This is an example of a very long string that will definitely cause horizontal scrolling in the code block component to demonstrate the right padding fix"

  return <div>Test</div>
}`,
  language: 'tsx',
  title: 'horizontal-overflow.tsx',
} as const;

/** Add enough vertical content to test the overlay placement. */
export const overflowOverlayFile = {
  code: `// Example with very long lines and maxLines to test overlay positioning
import { Button, Stack, Container, Text, Heading, Box, Flex, Grid, GridItem, VStack, HStack, Center, Circle, Square, Spacer, Wrap, WrapItem } from "@leverui/components"

const veryLongConfigurationObject = { primaryColor: "#3182ce", secondaryColor: "#805ad5", tertiaryColor: "#38b2ac", backgroundColor: "#ffffff", textColor: "#1a202c", fontSize: "16px", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif" }

function ExampleComponent() {
  const extremelyLongVariableName = "This is an example of a very long string that will definitely cause horizontal scrolling in the code block component"
  const anotherLongLine = "This line is also very long to ensure we have enough content that requires both vertical scrolling (maxLines) and horizontal scrolling"
  const yetAnotherLine = "More content here to exceed the maxLines limit and show the Expand code overlay at the bottom of the code block"

  return (
    <div>
      <span>Hello world</span>
    </div>
  )
}

export default ExampleComponent`,
  language: 'tsx',
  title: 'overflow-overlay-test.tsx',
} as const;

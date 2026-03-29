# Tool Template for Kimi WAT Framework

This template shows how to create deterministic tools that Kimi can execute reliably.

## Tool Structure

```python
#!/usr/bin/env python3
"""
[Tool Name]: [Brief description]

[Detailed description of what this tool does,
when to use it, and what problem it solves.]

Usage:
    python [tool_name].py [arguments]

Arguments:
    --input      Input file or data
    --output     Output file path
    --option     Additional options

Environment Variables:
    KIMI_API_KEY    Kimi API key (required)
    [OTHER_VARS]    Other required variables
"""

import os
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, List, Optional, Any
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def validate_environment() -> bool:
    """Validate required environment variables are set."""
    required_vars = ['KIMI_API_KEY']
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if missing:
        logger.error(f"Missing environment variables: {', '.join(missing)}")
        return False
    return True


def validate_inputs(args: argparse.Namespace) -> bool:
    """Validate command line arguments."""
    if args.input and not Path(args.input).exists():
        logger.error(f"Input file not found: {args.input}")
        return False
    return True


def process_data(data: Any, options: Dict) -> Any:
    """
    Main processing logic.
    
    Args:
        data: Input data to process
        options: Processing options
        
    Returns:
        Processed data
    """
    # Implementation here
    result = data  # Placeholder
    return result


def save_output(data: Any, output_path: str) -> bool:
    """Save output to file."""
    try:
        output_dir = Path(output_path).parent
        output_dir.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            if isinstance(data, (dict, list)):
                json.dump(data, f, indent=2, ensure_ascii=False)
            else:
                f.write(str(data))
        
        logger.info(f"Output saved to: {output_path}")
        return True
    except Exception as e:
        logger.error(f"Failed to save output: {e}")
        return False


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='[Tool description]',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python [tool_name].py --input data.json --output result.json
    python [tool_name].py --input data.json --verbose
        """
    )
    
    parser.add_argument(
        '--input', '-i',
        help='Input file path'
    )
    parser.add_argument(
        '--output', '-o',
        help='Output file path'
    )
    parser.add_argument(
        '--option', '-opt',
        help='Additional option'
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose logging'
    )
    
    args = parser.parse_args()
    
    # Set verbose logging
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    # Validate environment
    if not validate_environment():
        sys.exit(1)
    
    # Validate inputs
    if not validate_inputs(args):
        sys.exit(1)
    
    # Load input data
    try:
        if args.input:
            with open(args.input, 'r', encoding='utf-8') as f:
                data = json.load(f)
        else:
            # Read from stdin
            data = json.load(sys.stdin)
    except Exception as e:
        logger.error(f"Failed to load input: {e}")
        sys.exit(1)
    
    # Process data
    try:
        options = {
            'option': args.option
        }
        result = process_data(data, options)
        logger.info("Processing completed successfully")
    except Exception as e:
        logger.error(f"Processing failed: {e}")
        sys.exit(1)
    
    # Save or output result
    if args.output:
        if not save_output(result, args.output):
            sys.exit(1)
    else:
        # Output to stdout
        print(json.dumps(result, indent=2, ensure_ascii=False))
    
    sys.exit(0)


if __name__ == '__main__':
    main()
```

## Example Tools

### Example 1: Data Transformer

```python
#!/usr/bin/env python3
"""Transform CSV data to JSON format."""

import csv
import json
import argparse
from pathlib import Path

def csv_to_json(csv_path: str) -> list:
    """Convert CSV to list of dictionaries."""
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True, help='CSV file path')
    parser.add_argument('--output', required=True, help='JSON output path')
    args = parser.parse_args()
    
    data = csv_to_json(args.input)
    
    with open(args.output, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print(f"Converted {len(data)} records to {args.output}")

if __name__ == '__main__':
    main()
```

### Example 2: API Client

```python
#!/usr/bin/env python3
"""Make API calls with retry logic."""

import os
import requests
import time
from typing import Dict, Any

def api_call(
    url: str,
    method: str = 'GET',
    headers: Dict = None,
    data: Dict = None,
    max_retries: int = 3
) -> Dict[str, Any]:
    """Make API call with exponential backoff."""
    headers = headers or {}
    headers['Authorization'] = f"Bearer {os.getenv('API_KEY')}"
    
    for attempt in range(max_retries):
        try:
            response = requests.request(
                method=method,
                url=url,
                headers=headers,
                json=data,
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            if attempt == max_retries - 1:
                raise
            wait_time = 2 ** attempt
            print(f"Attempt {attempt + 1} failed, retrying in {wait_time}s...")
            time.sleep(wait_time)
```

### Example 3: File Processor

```python
#!/usr/bin/env python3
"""Process files in directory."""

import os
from pathlib import Path
from typing import List

def process_directory(
    input_dir: str,
    output_dir: str,
    file_extension: str = '.txt'
) -> List[str]:
    """Process all files in directory."""
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    processed = []
    
    for file in input_path.glob(f'*{file_extension}'):
        # Process file
        output_file = output_path / f"{file.stem}_processed{file_extension}"
        
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Transform content
        processed_content = content.upper()  # Example transformation
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(processed_content)
        
        processed.append(str(output_file))
    
    return processed
```

## Best Practices

### 1. Error Handling

```python
try:
    result = risky_operation()
except SpecificException as e:
    logger.error(f"Specific error: {e}")
    # Handle specifically
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    raise  # Re-raise if can't handle
```

### 2. Logging

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Use appropriate levels
logger.debug("Detailed debug info")
logger.info("General information")
logger.warning("Warning message")
logger.error("Error occurred")
```

### 3. Input Validation

```python
def validate_input(data: dict) -> bool:
    """Validate input data structure."""
    required_fields = ['name', 'email', 'message']
    
    for field in required_fields:
        if field not in data:
            logger.error(f"Missing required field: {field}")
            return False
        if not data[field]:
            logger.error(f"Empty field: {field}")
            return False
    
    return True
```

### 4. Environment Variables

```python
import os
from typing import Optional

def get_env_var(name: str, default: Optional[str] = None, required: bool = False) -> str:
    """Get environment variable with validation."""
    value = os.getenv(name, default)
    
    if required and not value:
        raise ValueError(f"Required environment variable {name} not set")
    
    return value

# Usage
API_KEY = get_env_var('KIMI_API_KEY', required=True)
DEBUG = get_env_var('DEBUG', 'false').lower() == 'true'
```

### 5. Testing

```python
import unittest
from unittest.mock import patch, MagicMock

class TestTool(unittest.TestCase):
    def setUp(self):
        self.sample_data = {'key': 'value'}
    
    def test_process_data(self):
        result = process_data(self.sample_data)
        self.assertEqual(result['processed'], True)
    
    @patch('requests.get')
    def test_api_call(self, mock_get):
        mock_get.return_value.json.return_value = {'status': 'ok'}
        result = api_call('https://api.example.com')
        self.assertEqual(result['status'], 'ok')

if __name__ == '__main__':
    unittest.main()
```

## Integration with Kimi

### Calling from Kimi

```python
from kimi_agent_sdk import prompt
import subprocess

async def run_tool():
    # Option 1: Use shell_execute tool
    result = subprocess.run(
        ['python', 'tools/my_tool.py', '--input', 'data.json'],
        capture_output=True,
        text=True
    )
    
    # Option 2: Direct SDK call
    async for msg in prompt("""
        Run the data transformation tool on input.json
        and save results to output.json
    """, yolo=True):
        print(msg.extract_text())
```

### Tool Registration

Add to `kimi-config.toml`:

```toml
[tools]
my_tool = {
    command = "python tools/my_tool.py",
    description = "Custom data transformation tool",
    inputs = ["input_file", "output_file"],
    outputs = ["output_file"]
}
```

## Directory Structure

```
tools/
├── TEMPLATE.md           # This template
├── __init__.py          # Package init
├── utils.py             # Shared utilities
├── data_transformer.py  # Example tool
├── api_client.py        # Example tool
└── file_processor.py    # Example tool
```

## Common Patterns

### Pattern 1: Chain Tools

```python
# Tool 1: Extract data
extracted = extract_data(source)

# Tool 2: Transform
transformed = transform_data(extracted)

# Tool 3: Load
load_data(transformed, destination)
```

### Pattern 2: Parallel Processing

```python
from concurrent.futures import ThreadPoolExecutor

def process_files_parallel(files: list, max_workers: int = 4):
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        results = list(executor.map(process_file, files))
    return results
```

### Pattern 3: Retry with Backoff

```python
import time
from functools import wraps

def retry(max_attempts=3, backoff=2):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    wait_time = backoff ** attempt
                    time.sleep(wait_time)
        return wrapper
    return decorator

@retry(max_attempts=3)
def unreliable_operation():
    pass
```

## Security Considerations

1. **Never hardcode secrets** - Use environment variables
2. **Validate all inputs** - Prevent injection attacks
3. **Use timeouts** - Prevent hanging operations
4. **Limit file access** - Use allowlists for paths
5. **Sanitize output** - Escape special characters

## Performance Tips

1. **Use generators** for large datasets
2. **Implement caching** for expensive operations
3. **Add progress bars** for long-running tasks
4. **Use connection pooling** for API calls
5. **Profile before optimizing**

---

**Remember:** Tools should be deterministic, testable, and focused on a single responsibility. Kimi handles the orchestration—you handle the execution.

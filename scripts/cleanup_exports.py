"""Local Docker operator command: one bounded batch of expired export artifacts.

Does not delete source data or receipts/audit history. Production scheduling and
least-privilege maintenance credentials are separate deployment work.
"""
import argparse
from local_db import sql


def cleanup(limit=100, database='ourspace'):
    if type(limit) is not int or not 1 <= limit <= 1000:
        raise ValueError('batch size must be 1..1000')
    return int(sql(f'SELECT app_internal.purge_expired_account_export_artifacts({limit});', database))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--limit', type=int, default=100)
    args = parser.parse_args()
    print(f'Expired export artifacts removed: {cleanup(args.limit)}')

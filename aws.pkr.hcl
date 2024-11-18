// aws.pkr.hcl
packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0,<2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  description = "AWS region to use"
  type        = string
  default     = "us-east-1" // Change to your preferred region
}

variable "ami_name" {
  description = "Name of the AMI"
  type        = string
  default     = "custom-ubuntu-24.04-{{timestamp}}"
}

variable "instance_type" {
  description = "Instance type for the builder"
  type        = string
  default     = "t2.micro" // Adjust according to your needs
}

variable "volume_size" {
  description = "Size of the root volume in GB"
  type        = number
  default     = 25 // Adjust as needed
}

variable "volume_type" {
  description = "Type of the root volume"
  type        = string
  default     = "gp2" // General Purpose SSD (gp2), provisioned IOPS (io1), etc.
}

variable "aws_source_ami" {
  description = "Source AMI ID for the builder"
  type        = string
}

variable "ssh_username" {
  description = "SSH username for the instance"
  type        = string
}

//variable "db_host" {
//  description = "Database host"
//  type        = string
//}

//variable "db_name" {
//  description = "Database name"
//  type        = string
//}

//variable "db_password" {
//  description = "Database password"
//  type        = string
//}

//variable "db_user" {
//  description = "Database user"
//  type        = string
//}

variable "demo_account_id" {
  description = "AWS account ID for demo purposes"
  type        = number
}

source "amazon-ebs" "ubuntu" {
  region           = var.aws_region
  source_ami       = var.aws_source_ami // Replace with the official Ubuntu 24.04 AMI ID
  instance_type    = var.instance_type
  ssh_username     = var.ssh_username
  ami_name         = "${var.ami_name}-${timestamp()}"
  ssh_wait_timeout = "10m"
  ami_description  = "Custom Ubuntu 24.04 image with Java, Tomcat, and MySQL"
  tags = {
    Name = "WebApp-Image"
  }

  aws_polling {
    delay_seconds = 120 // Delay between polling attempts
    max_attempts  = 50  // Maximum number of polling attempts
  }

  launch_block_device_mappings {
    device_name           = "/dev/sda1"
    volume_size           = var.volume_size
    delete_on_termination = true
    volume_type           = var.volume_type
  }
  ami_users = ["${var.demo_account_id}"]
}

build {
  sources = ["source.amazon-ebs.ubuntu"]

  provisioner "shell" {
    script = "scripts/install.sh"
  }

  provisioner "shell" {
    inline = [
      "sudo mkdir -p /tmp/webapp/",
      "sudo chmod 775 /tmp/webapp",
      "sudo chown -R csye6225:csye6225 /tmp/webapp"
    ]
  }

  provisioner "file" {
    source      = "webapp.zip"
    destination = "/tmp/webapp.zip"
  }


  provisioner "shell" {
    inline = [
      "cd /tmp",
      "sudo unzip -o webapp.zip -d /tmp/webapp",
      "sudo chown -R csye6225:csye6225 /tmp/webapp"
    ]
  }

  provisioner "shell" {
    script = "scripts/webapp.sh"
  }

  post-processor "manifest" {
    output = "manifest.json"
  }
}